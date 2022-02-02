"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommand = void 0;
var child_process_1 = require("child_process");
var path = require("path");
exports.getCommand = function (command, options) {
    if (options === void 0) { options = {}; }
    var ls = child_process_1.spawnSync(command, ['--version'], options);
    if ((ls.stdout && ls.stdout.toString()) && (!ls.stderr || !ls.stderr.toString())) {
        return command;
    }
    else {
        var binPath = child_process_1.spawnSync('npm', ['bin'], options).stdout.toString().replace(/\n/, '');
        return path.join(binPath, command);
    }
};
//# sourceMappingURL=binaries.js.map