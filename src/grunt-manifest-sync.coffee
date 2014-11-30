gruntManifestSync = (grunt) ->
  grunt.registerMultiTask "manifestSync", "A Grunt plugin for syncing common informatiom across many Json manifest files", ->

    options = this.options
      primaryManifest: "package.json"
      syncManifestFields: ["name", "description", "version"]
      manifests: {}

    loadPrimaryManifestData = (grunt)->
      #If file path was given, read file and store as object
      if typeof options.primaryManifest is "string"
        if grunt.file.exists options.primaryManifest
          options.primaryManifest = grunt.file.readJSON options.primaryManifest
        else
          grunt.fail.warn "The primaryManifest file \"#{options.primaryManifest}\" does not exist"

      #Check to make sure all syncManifestFields exist in primaryManifest
      for manifestField in options.syncManifestFields
        if !options.primaryManifest[manifestField]?
          grunt.fail.warn "primaryManifest must contain the field \"#{manifestField}\""

      #Trim down primaryManifest to only syncManifestFields
      onlySyncManifestFieldsData = {}

      for manifestField in options.syncManifestFields
        onlySyncManifestFieldsData[manifestField] = options.primaryManifest[manifestField]

      options.primaryManifest = onlySyncManifestFieldsData
    #end

    syncManifests = (grunt) ->
      for key, manifest of options.manifests
        dest = ""
        data = {}

        if typeof manifest is "object"
          if !manifest.dest? and !manifest._dest?
            grunt.fail.warn "Manifest object must have field \"dest\" or \"_dest\""

          if manifest._dest?
            dest = manifest._dest
            delete manifest._dest
          else
            dest = manifest.dest
            delete manifest.dest

          data = manifest

          for manifestField in options.syncManifestFields
            data[manifestField] = options.primaryManifest[manifestField] if !data[manifestField]?
        else
          dest = manifest

          if !grunt.file.exists dest
            grunt.log.warn "The manifest file \"#{dest}\" does not exist, creating \"#{dest}\""
          else
            data = grunt.file.read dest

          for manifestField in options.syncManifestFields
            data[manifestField] = options.primaryManifest[manifestField]

        grunt.file.write dest, JSON.stringify data, null, 2

    loadPrimaryManifestData grunt
    syncManifests grunt

module.exports = gruntManifestSync
