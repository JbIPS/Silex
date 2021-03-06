/**
 * Silex, live web creation
 * http://projects.silexlabs.org/?/silex/
 *
 * Copyright (c) 2012 Silex Labs
 * http://www.silexlabs.org/
 *
 * Silex is available under the GPL license
 * http://www.silexlabs.org/silex/silex-licensing/
 */

/**
 * @fileoverview Service used to interact with the unifile server.
 *     The Silex "tasks" are nodejs methods which Silex adds to the unifle API.
 *     This class is a singleton.
 *
 */


goog.provide('silex.service.SilexTasks');



/**
 * the Silex SilexTasks singleton
 * @constructor
 * based on http://www.inkfilepicker.com/
 * load and save data to and from the cloud storage services
 */
silex.service.SilexTasks = function() {

};
goog.addSingletonGetter(silex.service.SilexTasks);


/**
 * publish a website to a given folder
 * @param {FileInfo} file
 * @param {FileInfo} folder
 * @param {function(string)} cbk called when success
 * @param {function(string)=} opt_errCbk to receive the json response
 */
silex.service.SilexTasks.prototype.publish = function(file, folder, cbk, opt_errCbk) {
  this.callServer('/tasks/publish', JSON.stringify({
    'folder': folder,
    'file': file,
  }), 'POST', json => cbk(json), opt_errCbk);
};


/**
 * get the state of the current publication
 * @param {function({message:string, stop:boolean})} cbk to receive the json response
 * @param {function(string)=} opt_errCbk to receive the json response
 */
silex.service.SilexTasks.prototype.publishState = function(cbk, opt_errCbk) {
  // FIXME: use standard XMLHttpRequest instead of closure lib
  this.callServer('/tasks/publishState', '', 'GET', cbk, opt_errCbk);
};


/**
 * @param {string} url
 * @param {string} data
 * @param {string} method
 * @param cbk to receive the json response
 * @param {function(string)=} opt_errCbk to receive the json response
 */
silex.service.SilexTasks.prototype.callServer = function(url, data, method, cbk, opt_errCbk) {
  const oReq = new XMLHttpRequest();
  oReq.addEventListener('load', e => {
    /** @type {string} */
    let message = oReq.responseText;
    /** @type {Object} */
    let json = null;
    try {
      json = /** @type {Object} */ (JSON.parse(oReq.responseText));
      message = /** @type {string} */ (json.message);
    } catch(e) {} // may be an empty response or a "Internal Server Error" string
    // success of the request
    if(oReq.status === 200) {
      cbk(json);
    }
    else {
      console.error('Error while trying to connect with back end', message);
      if (opt_errCbk) {
        opt_errCbk(json ? json.message : message);
      }
    }
  });
  oReq.addEventListener('error', e => {
    console.error('could not load website', e);
    if (opt_errCbk) {
      opt_errCbk('Network error, please check your internet connection or try again later.');
    }
  });
  oReq.open(method, url);
  oReq.setRequestHeader('Content-Type', 'application/json');
  oReq.send(data);
};

