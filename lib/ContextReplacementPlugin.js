/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const path = require("path");
const ContextElementDependency = require("./dependencies/ContextElementDependency");

class ContextReplacementPlugin {
	constructor(resourceRegExp, newContentResource, newContentRecursive, newContentRegExp) {
		this.resourceRegExp = resourceRegExp;

		if(typeof newContentResource === "function") {
			this.newContentCallback = newContentResource;
		} else if(typeof newContentResource === "string" && typeof newContentRecursive === "object") {
			this.newContentResource = newContentResource;
			this.newContentCreateContextMap = (fs, callback) => {
				callback(null, newContentRecursive);
			};
		} else if(typeof newContentResource === "string" && typeof newContentRecursive === "function") {
			this.newContentResource = newContentResource;
			this.newContentCreateContextMap = newContentRecursive;
		} else {
			if(typeof newContentResource !== "string") {
				newContentRegExp = newContentRecursive;
				newContentRecursive = newContentResource;
				newContentResource = undefined;
			}
			if(typeof newContentRecursive !== "boolean") {
				newContentRegExp = newContentRecursive;
				newContentRecursive = undefined;
			}
			this.newContentResource = newContentResource;
			this.newContentRecursive = newContentRecursive;
			this.newContentRegExp = newContentRegExp;
		}
	}
}
module.exports = ContextReplacementPlugin;
ContextReplacementPlugin.prototype.apply = function(compiler) {
	var resourceRegExp = this.resourceRegExp;
	var newContentCallback = this.newContentCallback;
	var newContentResource = this.newContentResource;
	var newContentRecursive = this.newContentRecursive;
	var newContentRegExp = this.newContentRegExp;
	var newContentCreateContextMap = this.newContentCreateContextMap;
	compiler.plugin("context-module-factory", function(cmf) {
			cmf.plugin("before-resolve", function(result, callback) {
				if(!result) return callback();
				if(resourceRegExp.test(result.request)) {
					if(typeof newContentResource !== "undefined")
						result.request = newContentResource;
					if(typeof newContentRecursive !== "undefined")
						result.recursive = newContentRecursive;
					if(typeof newContentRegExp !== "undefined")
						result.regExp = newContentRegExp;
					if(typeof newContentCallback === "function") {
						newContentCallback(result);
					} else {
						let resultDependencies = result.dependencies;
						let dependenciesLength = result.dependencies.length;
						for(let i = 0; i < dependenciesLength; i++) {
							if(dependenciesLength[i])
								resultDependencies[i].critical = false;
						}
					}
				}
				return callback(null, result);
			});
			cmf.plugin("after-resolve", (result, callback) => {
					if(!result) return callback();
					if(resourceRegExp.test(result.resource)) {
						if(typeof newContentResource !== "undefined")
							result.resource = path.resolve(result.resource, newContentResource);
						if(typeof newContentRecursive !== "undefined")
							result.recursive = newContentRecursive;
						if(typeof newContentRegExp !== "undefined")
							result.regExp = newContentRegExp;
						if(typeof newContentCreateContextMap === "function")
							result.resolveDependencies = createResolveDependenciesFromContextMap(newContentCreateContextMap);
						if(typeof newContentCallback === "function") {
							const origResource = result.resource;
							newContentCallback(result);
							if(result.resource !== origResource) {
								result.resource = path.resolve(origResource, result.resource);
							}
						} else {
							result.dependencies.forEach((d) => {
								if(d.critical)
									d.critical = false;
							});
						} <<
						<< << < HEAD
					} else {
						let resultDependencies = result.dependencies;
						let dependenciesLength = result.dependencies.length;
						for(let i = 0; i < dependenciesLength; i++) {
							if(dependenciesLength[i])
								resultDependencies[i].critical = false;
						}
					} ===
					=== = >>>
					>>> > 416e5 beeb4bad32460fb40d64e527ff21cdef446
				}
				return callback(null, result);
			});
	});
}
}

const createResolveDependenciesFromContextMap = (createContextMap) => {
	return function resolveDependenciesFromContextMap(fs, resource, recursive, regExp, callback) {
		createContextMap(fs, (err, map) => {
			if(err) return callback(err);
			const dependencies = Object.keys(map).map((key) => {
				return new ContextElementDependency(map[key], key);
			});
			callback(null, dependencies);
		});
	};
};

module.exports = ContextReplacementPlugin;
