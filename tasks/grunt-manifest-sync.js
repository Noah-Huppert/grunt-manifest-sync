(function() {
  var gruntManifestSync;

  gruntManifestSync = function(grunt) {
    return grunt.registerMultiTask("manifestSync", "A Grunt plugin for syncing common informatiom across many Json manifest files", function() {
      var loadManifests, loadPrimaryManifestData, options, primaryManifestPath, syncManifests;
      options = this.options({
        primaryManifest: "package.json",
        syncManifestFields: ["name", "description", "version"],
        manifests: {}
      });
      primaryManifestPath = "";
      loadPrimaryManifestData = function(grunt) {
        var manifestField, onlySyncManifestFieldsData, _i, _j, _len, _len1, _ref, _ref1;
        if (typeof options.primaryManifest === "string") {
          if (grunt.file.exists(options.primaryManifest)) {
            primaryManifestPath = options.primaryManifest;
            options.primaryManifest = grunt.file.readJSON(options.primaryManifest);
          } else {
            grunt.fail.warn("The primaryManifest file \"" + options.primaryManifest + "\" does not exist");
          }
        }
        _ref = options.syncManifestFields;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          manifestField = _ref[_i];
          if (options.primaryManifest[manifestField] == null) {
            grunt.fail.warn("primaryManifest must contain the field \"" + manifestField + "\"");
          }
        }
        onlySyncManifestFieldsData = {};
        _ref1 = options.syncManifestFields;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          manifestField = _ref1[_j];
          onlySyncManifestFieldsData[manifestField] = options.primaryManifest[manifestField];
        }
        return options.primaryManifest = onlySyncManifestFieldsData;
      };
      loadManifests = function(grunt) {
        var extend, importManifestsSrc, manifest, manifestSrc, _i, _len;
        extend = require("extend");
        importManifestsSrc = [];
        if (options.manifests._import != null) {
          importManifestsSrc = options.manifests._import;
          delete options.manifests._import;
        } else if (options.manifests["import"] != null) {
          importManifestsSrc = options.manifests["import"];
          delete options.manifests["import"];
        }
        if (primaryManifestPath.length > 0 && importManifestsSrc.indexOf("FLAG_NO_PRIMARY_MANIFEST") === -1) {
          importManifestsSrc.push(primaryManifestPath);
        }
        if (importManifestsSrc.indexOf("FLAG_NO_PRIMARY_MANIFEST") >= 0) {
          importManifestsSrc.splice(importManifestsSrc.indexOf("FLAG_NO_PRIMARY_MANIFEST"), 1);
        }
        if (typeof importManifestsSrc === "string") {
          importManifestsSrc = [importManifestsSrc];
        }
        for (_i = 0, _len = importManifestsSrc.length; _i < _len; _i++) {
          manifestSrc = importManifestsSrc[_i];
          if (grunt.file.exists(manifestSrc)) {
            manifest = grunt.file.readJSON(manifestSrc);
            if (manifest.manifests == null) {
              if (manifestSrc !== primaryManifestPath) {
                grunt.fail.warn("The Json file \"" + manifestSrc + "\" must have the key \"manifests\"");
              } else {
                return;
              }
            }
            options.manifests = extend(options.manifests, manifest.manifests);
          } else {
            grunt.fail.warn("The file \"" + manifestSrc + "\" does not exist");
          }
        }
      };
      syncManifests = function(grunt) {
        var data, dest, key, manifest, manifestField, manifestIgnore, manifestIgnoreField, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
        _ref = options.manifests;
        _results = [];
        for (key in _ref) {
          manifest = _ref[key];
          dest = "";
          data = {};
          if (typeof manifest === "object") {
            manifestIgnore = [];
            if ((manifest.dest == null) && (manifest._dest == null)) {
              grunt.fail.warn("Manifest object must have field \"dest\" or \"_dest\"");
            }
            if (manifest._dest != null) {
              dest = manifest._dest;
              delete manifest._dest;
            } else {
              dest = manifest.dest;
              delete manifest.dest;
            }
            if (manifest._ignore != null) {
              manifestIgnore = manifest._ignore;
              delete manifest._ignore;
            } else if (manifest.ignore != null) {
              manifestIgnore = manifest.ignore;
              delete manifest.ignore;
            }
            data = manifest;
            _ref1 = options.syncManifestFields;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              manifestField = _ref1[_i];
              if (data[manifestField] == null) {
                data[manifestField] = options.primaryManifest[manifestField];
              }
            }
            for (_j = 0, _len1 = manifestIgnore.length; _j < _len1; _j++) {
              manifestIgnoreField = manifestIgnore[_j];
              delete data[manifestIgnoreField];
            }
          } else {
            dest = manifest;
            if (!grunt.file.exists(dest)) {
              grunt.log.warn("The manifest file \"" + dest + "\" does not exist, creating \"" + dest + "\"");
            } else {
              data = grunt.file.readJSON(dest);
            }
            _ref2 = options.syncManifestFields;
            for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
              manifestField = _ref2[_k];
              data[manifestField] = options.primaryManifest[manifestField];
            }
          }
          _results.push(grunt.file.write(dest, JSON.stringify(data, null, 2)));
        }
        return _results;
      };
      loadPrimaryManifestData(grunt);
      loadManifests(grunt);
      return syncManifests(grunt);
    });
  };

  module.exports = gruntManifestSync;

}).call(this);
