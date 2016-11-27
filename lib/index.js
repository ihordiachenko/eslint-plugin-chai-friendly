/**
 * @fileoverview This plugin makes &#39;no-unused-expressions&#39; rule friendly towards chai expect statements.
 * @author Ihor Diachenko
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


// import all rules in lib/rules
module.exports.rules = requireIndex(__dirname + "/rules");



