# Import.js
Small library for importing scripts into html document (using XHR).

## Compatibility

For internet explorer 11 or higher.

## How to use?

This library must be put in the head tag of html document.

``` html
<html>
    <head>
        <title> My page - Mi página </title>
        <script src="Import.js"></script>
        <script>

            const options = {
                mode: 'sync',          //optional for "defer" mode
                onload: function(){},  //optional
                onerror: function(){}  //optional
            }

            //Import sync (block parser). readyState = loading in this case
            Import.JS('src/script-1', options);
            Import.CSS('src/style-1', options);

            //Import async. readyState = interactive || complete
            options.mode = 'async';
            Import.JS('src/script-2', options);
            Import.CSS('src/style-2', options);

            //Import defer. readyState = interactive in this case
            options.mode = 'defer' || null;
            Import.JS('src/script-3', options);
            Import.JS('src/script-4');
            Import.CSS('src/style-3', options);
            Import.CSS('src/style-3');

        </script>
    </head>
    <body>
        <!-- page content - contenido de la página -->
    </body>
</html>
```

## API

Follow the example above.

## Authors

* **Emanuel Rojas Vásquez** - *Initial work* - [erovas](https://github.com/erovas)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/erovas/Import.js/blob/main/LICENSE) file for details.