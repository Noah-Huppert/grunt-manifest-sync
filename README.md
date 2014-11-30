# grunt-manifest-sync

> A Grunt plugin for syncing common informatiom across many Json manifest files

## Getting Started
This plugin requires Grunt `0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-manifest-sync --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-manifest-sync');
```

## The "manifestSync" task

### Overview
In your project's Gruntfile, add a section named `manifestSync` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  manifestSync: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.primaryManifest
Type: `String` or `Object`  
Default value: `package.json`

The primary manifest to sync all other manifests to. If `options.primaryManifest` is a `String` then the `manifestSync` task will fetch the file contents.

#### options.syncManifestFields
Type: `Array of Strings`  
Default value: `["name", "description", "version"]`  

The `Json` fields to sync from `options.primaryManifest`. The purpose of this field is to sync on the fields that are needed. This way if you have your `Npm` `package.json` as the `options.primaryManifest` the `manfiestSync` task will only sync the specified fields instead of the 20 other unwanted fields.

#### options.manifests
Type: `Object`  
Default value: `{}`  

The `options.manifests` field is used to specify the `Json` manifests files to sync from the `options.primaryManifest`. The values of `options.manifests` can be either/or a simple key value pair or a complex object

***Simple Key Value Pair***  
The simple key value pair simply specifies the file path of a `Json` manifest to sync. The `manifestSync` task will automatically detect if a file exists and create the file if it does not exist, or only override the `options.syncManifestFields` fields if it exists.
```js
manifestSync: {
  dist: {
    options: {
      manifests: {
        bower: "bower.json",
        chromeExtension: "extension/manifest.json"
      }
    }
  }
}
```
This example configuration will sync the `bower.json` file and the `extension/manifest.json` file  

***Complex object***  
The complex object option is for more complected manifests. Its purpose is to add or override manifest specific fields.
> **Fields**
> ###dest
> Optional: `False`  
> Type: `String`  
> Default value: `None`  
>
> Specifies were to write the manifest to. If your complex object needs to use the `dest` field then use the `_dest` field instead
>  
> ###ignore
> Optional: `True`  
> Type: `Array of Strings`  
> Default value: `[]`
>
> Specifies fields to ignore. For example if you would like to ignore the `version` field completely simply add the `version` field to the `ignore` field. If your complex object needs to use the `ignore` field use the `_ignore` field instead.
> ```js
> manifestSync: {
>   dist: {
>     options: {
>       manifests: {
>         bower: "bower.json",
>         chromeExtension: {
>           dest: "extension/manifest.json",
>           ignore: ["version"]
>         }
>       }
>     }
>   }
> }
> ```

 <!--You must specify a `dest` field in the complex object to specify were to write the manifest too. If you need to use a field named `dest` in your custom manifest then use the field `_dest` instead. -->The rest of the fields can be custom fields for your manifest.
```js
manifestSync: {
  dist: {
    options: {
      manifests: {
        bower: {
          dest: "bower.json",
          private: true,
          dependencies: {
            ember: "~1.8.1",
            ember-data: "~0.0.14"
          },
          resolutions: {
            ember: "~1.8.1"
          }
        },
        chromeExtension: {
          name: "Custom name for Chrome extension",
          version: "1.0.0-chrome",
          permissions: [
            "http://google.com"
          ]
        }
      }
    }
  }
}
```
Please note that complex objects can be used with simple key value pairs as well.

### Usage Examples

#### Default Options
In this example all default values are used. The only custom options are the `options.manifests` to sync. In `options.manifests` both simple key value pairs and complex objects are used
```js
grunt.initConfig({
  manifestSync: {
    dist: {
      options: {
        manifests: {
          bower: "bower.json",
          chromeExtension: {
            description: "A Chrome extension that allows you to foo bazz"
          }
        }
      }
    }
  }
});
```

#### Custom Primary Manifest Path
In this example a custom `options.primaryManifest` file is specified via its path
```js
grunt.initConfig({
  manifestSync: {
    dist: {
      options: {
        primaryManifest: "distManifest.json",
        manifests: {
          bower: "bower.json",
          chromeExtension: {
            description: "A Chrome extension that allows you to foo bazz"
          }
        }
      }
    }
  }
});
```
and in `distManifest.json`
```json
{
  "name": "Foo Bazz!",
  "description": "The best description",
  "version": "1.0.0-dist"
}
```

#### Custom Primary Manifest Object
In this example a custom `options.primaryManifest` file is specified via an object
```js
grunt.initConfig({
  manifestSync: {
    dist: {
      options: {
        primaryManifest: {
          name: "Foo Bazz!",
          description: "The best description",
          version: "1.0.0-dist"
        },
        manifests: {
          bower: "bower.json",
          chromeExtension: {
            description: "A Chrome extension that allows you to foo bazz"
          }
        }
      }
    }
  }
});
```

#### Custom Sync Manifest Fields
In this example custom sync fields are specified
```js
grunt.initConfig({
  manifestSync: {
    dist: {
      options: {
        syncManifestFields: ["name", "flavor"]
        primaryManifest: {
          name: "Foo Bazz!",
          flavor: "dist"
        },
        manifests: {
          bower: "bower.json",
          chromeExtension: {
            flavor: "dist-chrome"
          }
        }
      }
    }
  }
});
```

## Release History

 * 2014-11-29   v1.0.0   Initial release
