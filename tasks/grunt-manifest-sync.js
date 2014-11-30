(function() {
  var gruntManifestSync;

  gruntManifestSync = function(grunt) {
    return grunt.registerMultiTask("manifestSync", "A Grunt plugin for syncing common informatiom across many Json manifest files", function() {
      var loadPrimaryManifestData, options, syncManifests;
      options = this.options({
        primaryManifest: "package.json",
        syncManifestFields: ["name", "description", "version"],
        manifests: {}
      });
      loadPrimaryManifestData = function(grunt) {
        var manifestField, onlySyncManifestFieldsData, _i, _j, _len, _len1, _ref, _ref1;
        if (typeof options.primaryManifest === "string") {
          if (grunt.file.exists(options.primaryManifest)) {
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
      syncManifests = function(grunt) {
        var data, dest, key, manifest, manifestField, _i, _j, _len, _len1, _ref, _ref1, _ref2, _results;
        _ref = options.manifests;
        _results = [];
        for (key in _ref) {
          manifest = _ref[key];
          dest = "";
          data = {};
          if (typeof manifest === "object") {
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
            data = manifest;
            _ref1 = options.syncManifestFields;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
              manifestField = _ref1[_i];
              if (data[manifestField] == null) {
                data[manifestField] = options.primaryManifest[manifestField];
              }
            }
          } else {
            dest = manifest;
            if (!grunt.file.exists(dest)) {
              grunt.log.warn("The manifest file \"" + dest + "\" does not exist, creating \"" + dest + "\"");
            } else {
              data = grunt.file.read(dest);
            }
            _ref2 = options.syncManifestFields;
            for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
              manifestField = _ref2[_j];
              data[manifestField] = options.primaryManifest[manifestField];
            }
          }
          _results.push(grunt.file.write(dest, JSON.stringify(data, null, 2)));
        }
        return _results;
      };
      loadPrimaryManifestData(grunt);
      return syncManifests(grunt);
    });
  };

  module.exports = gruntManifestSync;

}).call(this);
