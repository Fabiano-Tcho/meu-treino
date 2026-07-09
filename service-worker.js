const CACHE_NAME = "treino-plus-v1";


const arquivosCache = [

    "./",

    "./index.html",

    "./style.css",

    "./script.js",

    "./manifest.json",

    "./logo-treino-plus.png"

];


self.addEventListener(
    "install",
    function(evento) {

        evento.waitUntil(

            caches.open(
                CACHE_NAME
            )
            .then(
                function(cache) {

                    return cache.addAll(
                        arquivosCache
                    );
                }
            )
        );
    }
);


self.addEventListener(
    "fetch",
    function(evento) {

        evento.respondWith(

            caches.match(
                evento.request
            )
            .then(
                function(resposta) {

                    return (
                        resposta ||
                        fetch(evento.request)
                    );
                }
            )
        );
    }
);