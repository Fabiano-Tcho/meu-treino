const CACHE_NAME =
    "treino-plus-v1-beta-4";


const ARQUIVOS_CACHE = [

    "./",

    "./index.html",

    "./style.css",

    "./script.js",

    "./manifest.json",

    "./logo-treino-plus.png",

    "./icone-treino-plus-192.png",

    "./icone-treino-plus-512.png",

    "./icone-treino-plus-maskable-512.png"

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
                        ARQUIVOS_CACHE
                    );
                }
            )
        );


        self.skipWaiting();
    }
);


self.addEventListener(
    "activate",
    function(evento) {

        evento.waitUntil(

            caches.keys()
                .then(
                    function(nomesCaches) {

                        return Promise.all(

                            nomesCaches.map(
                                function(nomeCache) {

                                    if (
                                        nomeCache !==
                                        CACHE_NAME
                                    ) {

                                        return caches.delete(
                                            nomeCache
                                        );
                                    }

                                }
                            )
                        );
                    }
                )
                .then(
                    function() {

                        return self.clients.claim();
                    }
                )
        );
    }
);


self.addEventListener(
    "fetch",
    function(evento) {

        if (
            evento.request.method !== "GET"
        ) {

            return;
        }


        evento.respondWith(

            fetch(
                evento.request
            )
            .then(
                function(respostaRede) {

                    const copiaResposta =
                        respostaRede.clone();


                    caches.open(
                        CACHE_NAME
                    )
                    .then(
                        function(cache) {

                            cache.put(
                                evento.request,
                                copiaResposta
                            );
                        }
                    );


                    return respostaRede;
                }
            )
            .catch(
                function() {

                    return caches.match(
                        evento.request
                    );
                }
            )
        );
    }
);