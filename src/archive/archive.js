/**
 * archive.js
 *
 * Provides base functionality for unarchiving.
 *
 * Licensed under the MIT License
 *
 * Copyright(c) 2011 Google Inc.
 */

import { findMimeType } from "../file/sniffer.js";
import unrarWorkerUrl from "worker-plugin/loader?name=0!./unrar.js";
import untarWorkerUrl from "worker-plugin/loader?name=1!./untar.js";
import unzipWorkerUrl from "worker-plugin/loader?name=2!./unzip.js";

/**
 * An unarchive event.
 */
export class UnarchiveEvent {
  /**
   * @param {string} type The event type.
   */
  constructor(type) {
    /**
     * The event type.
     * @type {string}
     */
    this.type = type;
  }
}

/**
 * The UnarchiveEvent types.
 */
export const UnarchiveEventType = {
  START: "start",
  PROGRESS: "progress",
  EXTRACT: "extract",
  FINISH: "finish",
  INFO: "info",
  ERROR: "error",
};

/**
 * Useful for passing info up to the client (for debugging).
 */
export class UnarchiveInfoEvent extends UnarchiveEvent {
  /**
   * @param {string} msg The info message.
   */
  constructor(msg) {
    super(UnarchiveEventType.INFO);

    /**
     * The information message.
     * @type {string}
     */
    this.msg = msg;
  }
}

/**
 * An unrecoverable error has occured.
 */
export class UnarchiveErrorEvent extends UnarchiveEvent {
  /**
   * @param {string} msg The error message.
   */
  constructor(msg) {
    super(UnarchiveEventType.ERROR);

    /**
     * The information message.
     * @type {string}
     */
    this.msg = msg;
  }
}

/**
 * Start event.
 */
export class UnarchiveStartEvent extends UnarchiveEvent {
  constructor() {
    super(UnarchiveEventType.START);
  }
}

/**
 * Finish event.
 */
export class UnarchiveFinishEvent extends UnarchiveEvent {
  /**
   * @param {Object} metadata A collection fo metadata about the archive file.
   */
  constructor(metadata = {}) {
    super(UnarchiveEventType.FINISH);
    this.metadata = metadata;
  }
}

/**
 * Progress event.
 */
export class UnarchiveProgressEvent extends UnarchiveEvent {
  /**
   * @param {string} currentFilename
   * @param {number} currentFileNumber
   * @param {number} currentBytesUnarchivedInFile
   * @param {number} currentBytesUnarchived
   * @param {number} totalUncompressedBytesInArchive
   * @param {number} totalFilesInArchive
   * @param {number} totalCompressedBytesRead
   */
  constructor(
    currentFilename,
    currentFileNumber,
    currentBytesUnarchivedInFile,
    currentBytesUnarchived,
    totalUncompressedBytesInArchive,
    totalFilesInArchive,
    totalCompressedBytesRead
  ) {
    super(UnarchiveEventType.PROGRESS);

    this.currentFilename = currentFilename;
    this.currentFileNumber = currentFileNumber;
    this.currentBytesUnarchivedInFile = currentBytesUnarchivedInFile;
    this.totalFilesInArchive = totalFilesInArchive;
    this.currentBytesUnarchived = currentBytesUnarchived;
    this.totalUncompressedBytesInArchive = totalUncompressedBytesInArchive;
    this.totalCompressedBytesRead = totalCompressedBytesRead;
  }
}

/**
 * Extract event.
 */
export class UnarchiveExtractEvent extends UnarchiveEvent {
  /**
   * @param {UnarchivedFile} unarchivedFile
   */
  constructor(unarchivedFile) {
    super(UnarchiveEventType.EXTRACT);

    /**
     * @type {UnarchivedFile}
     */
    this.unarchivedFile = unarchivedFile;
  }
}

/**
 * All extracted files returned by an Unarchiver will implement
 * the following interface:
 *
 * interface UnarchivedFile {
 *   string filename
 *   TypedArray fileData
 * }
 *
 */

/**
 * Base class for all Unarchivers.
 */
export class Unarchiver {
  /**
   * @param {ArrayBuffer} arrayBuffer The Array Buffer.
   * @param {string} opt_pathToBitJS Optional string for where the BitJS files are located.
   */
  constructor(arrayBuffer, workerRootPath) {
    /**
     * The ArrayBuffer object.
     * @type {ArrayBuffer}
     * @protected
     */
    this.ab = arrayBuffer;

    /**
     * The path to the BitJS files.
     * @type {string}
     * @private
     */
    this.workerRootPath = workerRootPath;

    /**
     * A map from event type to an array of listeners.
     * @type {Map.<string, Array>}
     */
    this.listeners_ = {};
    for (let type in UnarchiveEventType) {
      this.listeners_[UnarchiveEventType[type]] = [];
    }

    /**
     * Private web worker initialized during start().
     * @type {Worker}
     * @private
     */
    this.worker_ = null;
  }

  /**
   * This method must be overridden by the subclass to return the worker.
   * @return {any} The worker.
   * @protected.
   */
  getWorker() {
    throw "Subclasses of AbstractUnarchiver must overload getWorker()";
  }

  /**
   * Adds an event listener for UnarchiveEvents.
   *
   * @param {string} Event type.
   * @param {function} An event handler function.
   */
  addEventListener(type, listener) {
    if (type in this.listeners_) {
      if (this.listeners_[type].indexOf(listener) == -1) {
        this.listeners_[type].push(listener);
      }
    }
  }

  /**
   * Removes an event listener.
   *
   * @param {string} Event type.
   * @param {EventListener|function} An event listener or handler function.
   */
  removeEventListener(type, listener) {
    if (type in this.listeners_) {
      const index = this.listeners_[type].indexOf(listener);
      if (index != -1) {
        this.listeners_[type].splice(index, 1);
      }
    }
  }

  /**
   * Create an UnarchiveEvent out of the object sent back from the Worker.
   * @param {Object} obj
   * @return {UnarchiveEvent}
   * @private
   */
  createUnarchiveEvent_(obj) {
    switch (obj.type) {
      case UnarchiveEventType.START:
        return new UnarchiveStartEvent();
      case UnarchiveEventType.PROGRESS:
        return new UnarchiveProgressEvent(
          obj.currentFilename,
          obj.currentFileNumber,
          obj.currentBytesUnarchivedInFile,
          obj.currentBytesUnarchived,
          obj.totalUncompressedBytesInArchive,
          obj.totalFilesInArchive,
          obj.totalCompressedBytesRead
        );
      case UnarchiveEventType.EXTRACT:
        return new UnarchiveExtractEvent(obj.unarchivedFile);
      case UnarchiveEventType.FINISH:
        return new UnarchiveFinishEvent(obj.metadata);
      case UnarchiveEventType.INFO:
        return new UnarchiveInfoEvent(obj.msg);
      case UnarchiveEventType.ERROR:
        return new UnarchiveErrorEvent(obj.msg);
    }
  }

  /**
   * Receive an event and pass it to the listener functions.
   *
   * @param {Object} obj
   * @private
   */
  handleWorkerEvent_(obj) {
    const type = obj.type;
    if (
      type &&
      Object.values(UnarchiveEventType).includes(type) &&
      this.listeners_[obj.type] instanceof Array
    ) {
      const evt = this.createUnarchiveEvent_(obj);
      this.listeners_[evt.type].forEach(function (listener) {
        listener(evt);
      });
      if (evt.type == UnarchiveEventType.FINISH) {
        this.worker_.terminate();
      }
    } else {
      console.log(`Unknown object received from worker: ${obj}`);
    }
  }

  /**
   * Starts the unarchive in a separate Web Worker thread and returns immediately.
   */
  start() {
    const me = this;
    const worker = this.getWorker();
    if (worker) {
      this.worker_ = worker;

      this.worker_.onerror = function (e) {
        console.log("Worker error: message = " + e.message);
        throw e;
      };

      this.worker_.onmessage = function (e) {
        if (typeof e.data == "string") {
          // Just log any strings the workers pump our way.
          console.log(e.data);
        } else {
          me.handleWorkerEvent_(e.data);
        }
      };

      const ab = this.ab;
      this.worker_.postMessage({
        file: ab,
        logToConsole: false,
      });
      this.ab = null;
    }
  }

  /**
   * Adds more bytes to the unarchiver's Worker thread.
   * @param {ArrayBuffer} ab The ArrayBuffer with more bytes in it.
   */
  update(ab) {
    if (this.worker_) {
      this.worker_.postMessage({ bytes: ab });
    }
  }

  /**
   * Terminates the Web Worker for this Unarchiver and returns immediately.
   */
  stop() {
    if (this.worker_) {
      this.worker_.terminate();
    }
  }
}

/**
 * Unzipper
 */
export class Unzipper extends Unarchiver {
  constructor(arrayBuffer, workerRootPath = null) {
    super(arrayBuffer, workerRootPath);
  }

  getWorker() {
    if (this.workerRootPath) {
      return new Worker(this.workerRootPath + "/" + unzipWorkerUrl);
    }
    return new Worker("./unzip.js", { type: "module" });
  }
}

/**
 * Unrarrer
 */
export class Unrarrer extends Unarchiver {
  constructor(arrayBuffer, workerRootPath = null) {
    super(arrayBuffer, workerRootPath);
  }

  getWorker() {
    if (this.workerRootPath) {
      return new Worker(this.workerRootPath + "/" + unrarWorkerUrl);
    }
    return new Worker("./unrar.js", { type: "module" });
  }
}

/**
 * Untarrer
 * @extends {Unarchiver}
 * @constructor
 */
export class Untarrer extends Unarchiver {
  constructor(arrayBuffer, workerRootPath = null) {
    super(arrayBuffer, workerRootPath);
  }

  getWorker() {
    if (this.workerRootPath) {
      return new Worker(this.workerRootPath + "/" + untarWorkerUrl);
    }
    return new Worker("./untar.js", { type: "module" });
  }
}

/**
 * Factory method that creates an unarchiver based on the byte signature found
 * in the arrayBuffer.
 * @param {ArrayBuffer} ab
 * @param {string=} workerRootPath Path to the unarchiver script files.
 * @return {Unarchiver}
 */
export function getUnarchiver(ab, workerRootPath = null) {
  if (ab.byteLength < 10) {
    return null;
  }

  let unarchiver = null;
  const mimeType = findMimeType(ab);
  if (mimeType === "application/x-rar-compressed") {
    // Rar!
    unarchiver = new Unrarrer(ab, workerRootPath);
  } else if (mimetype === "application/zip") {
    // PK (Zip)
    unarchiver = new Unzipper(ab, workerRootPath);
  } else {
    // Try with tar
    unarchiver = new Untarrer(ab, workerRootPath);
  }
  return unarchiver;
}
