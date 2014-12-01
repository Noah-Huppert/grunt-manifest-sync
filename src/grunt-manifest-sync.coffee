gruntManifestSync = (grunt) ->
  grunt.registerMultiTask "manifestSync", "A Grunt plugin for syncing common informatiom across many Json manifest files", ->

    options = this.options
      primaryManifest: "package.json"
      syncManifestFields: ["name", "description", "version"]
      manifests: {}

    primaryManifestPath = ""

    loadPrimaryManifestData = (grunt)->
      #If file path was given, read file and store as object
      if typeof options.primaryManifest is "string"
        if grunt.file.exists options.primaryManifest
          primaryManifestPath = options.primaryManifest
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

    loadManifests = (grunt) ->
      extend = require "extend"
      importManifestsSrc = []

      #Get import field
      if options.manifests._import?
        importManifestsSrc = options.manifests._import
        delete options.manifests._import
      else if options.manifests.import?
        importManifestsSrc = options.manifests.import
        delete options.manifests.import

      if primaryManifestPath.length > 0 and importManifestsSrc.indexOf("FLAG_NO_PRIMARY_MANIFEST") == -1
        importManifestsSrc.push primaryManifestPath

      if importManifestsSrc.indexOf("FLAG_NO_PRIMARY_MANIFEST") >= 0
        importManifestsSrc.splice(importManifestsSrc.indexOf("FLAG_NO_PRIMARY_MANIFEST"), 1)

      #Convert to array if only string
      if typeof importManifestsSrc is "string"
        importManifestsSrc = [importManifestsSrc]

      for manifestSrc in importManifestsSrc
        if grunt.file.exists manifestSrc
          manifest = grunt.file.readJSON manifestSrc
          if !manifest.manifests?
            if manifestSrc != primaryManifestPath
              grunt.fail.warn "The Json file \"#{manifestSrc}\" must have the key \"manifests\""
            else
              return

          options.manifests = extend options.manifests, manifest.manifests
        else
          grunt.fail.warn "The file \"#{manifestSrc}\" does not exist"


    syncManifests = (grunt) ->
      for key, manifest of options.manifests
        dest = ""
        data = {}

        if typeof manifest is "object"
          manifestIgnore = []

          if !manifest.dest? and !manifest._dest?
            grunt.fail.warn "Manifest object must have field \"dest\" or \"_dest\""

          if manifest._dest?
            dest = manifest._dest
            delete manifest._dest
          else
            dest = manifest.dest
            delete manifest.dest

          #Get optional fields
          if manifest._ignore?
            manifestIgnore = manifest._ignore
            delete manifest._ignore
          else if manifest.ignore?
            manifestIgnore = manifest.ignore
            delete manifest.ignore

          data = manifest

          for manifestField in options.syncManifestFields
            data[manifestField] = options.primaryManifest[manifestField] if !data[manifestField]?

          #Ignore fields
          for manifestIgnoreField in manifestIgnore
            delete data[manifestIgnoreField]
        else
          dest = manifest

          if !grunt.file.exists dest
            grunt.log.warn "The manifest file \"#{dest}\" does not exist, creating \"#{dest}\""
          else
            data = grunt.file.readJSON dest

          for manifestField in options.syncManifestFields
            data[manifestField] = options.primaryManifest[manifestField]

        grunt.file.write dest, JSON.stringify data, null, 2

    loadPrimaryManifestData grunt
    loadManifests grunt
    syncManifests grunt

module.exports = gruntManifestSync
