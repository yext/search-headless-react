const express = require('express');

/**
 * A simple http server
 */
class HttpServer {
  /**
   * Constructs the server
   * 
   * @param {Object} config - The server config
   * @param {string} config.dir - The public directory to serve at
   * @param {number} config.port - The port to serve at
   */
  constructor ({ dir, port }) {
    this._app = express();
    this._app.use(express.static(dir));
    this._port = port;
  }

  /**
   * Starts the server
   */
  start () {
    this._server = this._app.listen(this._port, () => {
      console.log(`listening at http://localhost:${this._port}`);
    });
  }

  /**
   * Shuts down the server
   */
  shutdown () {
    this._server.close();
  }
}

module.exports = HttpServer;