# Pacchetti di file

Torniamo agli oggetti del database per il tuo repository Git di test. A questo punto hai 11 oggetti: 4 blob, 3 tree, 3 commit, e 1 tag:

	$ find .git/objects -type f
	.git/objects/01/55eb4229851634a0f03eb265b69f5a2d56f341 # tree 2
	.git/objects/1a/410efbd13591db07496601ebc7a059dd55cfe9 # commit 3
	.git/objects/1f/7a7a472abf3dd9643fd615f6da379c4acb3e3a # test.txt v2
	.git/objects/3c/4e9cd789d88d8d89c1073707c3585e41b0e614 # tree 3
	.git/objects/83/baae61804e65cc73a7201a7252750c76066a30 # test.txt v1
	.git/objects/95/85191f37f7b0fb9444f35a9bf50de191beadc2 # tag
	.git/objects/ca/c0cab538b970a37ea1e769cbbde608743bc96d # commit 2
	.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4 # 'test content'
	.git/objects/d8/329fc1cc938780ffdd9f94e0d364e0ea74f579 # tree 1
	.git/objects/fa/49b077972391ad58037050f2a75f74e3671e92 # new.txt
	.git/objects/fd/f4fc3344e67ab068f836878b6c4951e3b15f3d # commit 1

Git comprime il contenuto di questi file con zlib e, poiché non stai memorizzando molte cose, complessivamente tutti questi file occupano solo 925 bytes. Aggiungeremo al repository del contenuto più pesante per dimostrare un’interessante caratteristica di Git. Aggiungi il file repo.rb dalla libreria Grit che abbiamo visto prima: sono circa 12K di sorgenti:

	$ curl http://github.com/mojombo/grit/raw/master/lib/grit/repo.rb > repo.rb
	$ git add repo.rb 
	$ git commit -m ‘aggiunto repo.rb'
	[master 484a592] aggiunto repo.rb
	 3 files changed, 459 insertions(+), 2 deletions(-)
	 delete mode 100644 bak/test.txt
	 create mode 100644 repo.rb
	 rewrite test.txt (100%)

Se guardi l’albero dopo questa nuova commit, vedrai l’hash SHA-1 che l’oggetto blob per repo.rb:

	$ git cat-file -p master^{tree}
	100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
	100644 blob 9bc1dc421dcd51b4ac296e3e5b6e2a99cf44391e      repo.rb
	100644 blob e3f094f522629ae358806b17daf78246c27c007b      test.txt

Puoi quindi usare `git cat-file` per vedere le dimensioni dell’oggetto:

	$ git cat-file -s 9bc1dc421dcd51b4ac296e3e5b6e2a99cf44391e
	12898

Modifica un po’ il file e guarda che succede:

	$ echo '# testing' >> repo.rb 
	$ git commit -am 'modificato un poco il repository'
	[master ab1afef] modificato un poco il repository
	 1 files changed, 1 insertions(+), 0 deletions(-)

Verificando l’albero risultate da questa commit vedrai qualcosa d’interessante:

	$ git cat-file -p master^{tree}
	100644 blob fa49b077972391ad58037050f2a75f74e3671e92      new.txt
	100644 blob 05408d195263d853f09dca71d55116663690c27c      repo.rb
	100644 blob e3f094f522629ae358806b17daf78246c27c007b      test.txt

Il blob è un oggetto differente, cioè, nonostante tu abbia aggiunto una sola riga alla fine di un file da 400 righe, Git memorizza il nuovo contenuto come un oggetto completamente nuovo:

	$ du -b .git/objects/05/408d195263d853f09dca71d55116663690c27c
	4109	.git/objects/05/408d195263d853f09dca71d55116663690c27c

Ora hai sul disco due oggetti quasi identici da 4K. Non sarebbe carino se Git potesse memorizzarne solo una per intero e del secondo solo la differenza col primo?

In effetti può farlo. Il formato iniziale con cui Git salva l’oggetto sul disco con un formato cosiddetto sciolto (*loose*). Però, occasionalmente, Git compatta molti di questi oggetti in un singolo file binario detto “pacchetto di file” (*packfile*) per risparmiare spazio ed essere più efficiente. Git lo fa se hai molti oggetti sciolti sparpagliati, se esegui il comando `git gc` o se fai la push verso un server remoto. Puoi farlo manualmente, per vedere cosa succede, eseguendo il comando `git gc`, che forza Git a comprimere gli oggetti:

	$ git gc
	Counting objects: 17, done.
	Delta compression using 2 threads.
	Compressing objects: 100% (13/13), done.
	Writing objects: 100% (17/17), done.
	Total 17 (delta 1), reused 10 (delta 0)

Se consulti la directory degli oggetti, vedrai che molti dei tuoi oggetti sono scomparsi, ma ne sono apparsi un paio nuovo:

	$ find .git/objects -type f
	.git/objects/71/08f7ecb345ee9d0084193f147cdad4d2998293
	.git/objects/d6/70460b4b4aece5915caf5c68d12f560a9fe3e4
	.git/objects/info/packs
	.git/objects/pack/pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.idx
	.git/objects/pack/pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.pack

Gli oggetti rimanenti sono i blob che non puntano a nessuna commit: in questo caso gli esempi "what is up, doc?" e "test content" creati precedentemente. Poiché non li abbiamo ancora aggiunti a nessuna commit, vengono considerati Because you never added them to any commits, they’re considered dondolanti (*dangling*) e non sono compressi nei pacchetto appena creato.

I nuovi file sono il pacchetto e un indice. Il pacchetto è un singolo file contenente tutti gli altri oggetti che sono stati rimossi dal filesystem. L’indice è un file che contiene gli offset degli oggetti contenuti nel pacchetto per trovare velocemente un oggetto specifico. La cosa interessante è che, sebbene gli oggetti occupassero 12K sul disco prima dell’esecuzione di `gc`, il nuovo pacchetto è di soli 6K. Hai dimezzato lo spazio usato sul disco comprimendo gli oggetti.

Git come ci riesce? Quando Git comprime gli oggetti, cerca prima i file che hanno lo stesso nome e dimensioni simili, e memorizza solo le differenze tra i singoli file. Puoi controllare dentro il pacchetto e vedere cos’ha fatto Git per risparmiare spazio. Il comando *plumbing* `git verify-pack` ti permette di vedere cos’è stato compresso:

	$ git verify-pack -v \
	  .git/objects/pack/pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.idx
	0155eb4229851634a0f03eb265b69f5a2d56f341 tree   71 76 5400
	05408d195263d853f09dca71d55116663690c27c blob   12908 3478 874
	09f01cea547666f58d6a8d809583841a7c6f0130 tree   106 107 5086
	1a410efbd13591db07496601ebc7a059dd55cfe9 commit 225 151 322
	1f7a7a472abf3dd9643fd615f6da379c4acb3e3a blob   10 19 5381
	3c4e9cd789d88d8d89c1073707c3585e41b0e614 tree   101 105 5211
	484a59275031909e19aadb7c92262719cfcdf19a commit 226 153 169
	83baae61804e65cc73a7201a7252750c76066a30 blob   10 19 5362
	9585191f37f7b0fb9444f35a9bf50de191beadc2 tag    136 127 5476
	9bc1dc421dcd51b4ac296e3e5b6e2a99cf44391e blob   7 18 5193 1 \
	  05408d195263d853f09dca71d55116663690c27c
	ab1afef80fac8e34258ff41fc1b867c702daa24b commit 232 157 12
	cac0cab538b970a37ea1e769cbbde608743bc96d commit 226 154 473
	d8329fc1cc938780ffdd9f94e0d364e0ea74f579 tree   36 46 5316
	e3f094f522629ae358806b17daf78246c27c007b blob   1486 734 4352
	f8f51d7d8a1760462eca26eebafde32087499533 tree   106 107 749
	fa49b077972391ad58037050f2a75f74e3671e92 blob   9 18 856
	fdf4fc3344e67ab068f836878b6c4951e3b15f3d commit 177 122 627
	chain length = 1: 1 object
	pack-7a16e4488ae40c7d2bc56ea2bd43e25212a66c45.pack: ok

Dove il blob `9bc1d`, che ricorderai era la prima versione del file repo.rb, è referenziato dal blob `05408`, che era la seconda versione. La terza colonna indica la dimensione degli oggetti nel pacchetto, e puoi vedere che `05408` occupa 12K, ma `9bc1d` solo 7 bytes. Un’altra cosa interessante è che la seconda versione del file è quella che è stata memorizzata intatta, mentre della versione originale è stato memorizzata solo il delta: questo perché è molto più probabile che avrai bisogno di accedere più velocemente alla versione più recente di un file.

La cosa ancora più interessante è che può essere ricompresso in qualsiasi momento. Git ricomprime automaticamente il tuo database cercando sempre di risparmiare spazio. Puoi comunque ricomprimere il tuo database manualmente in qualsiasi momento, eseguendo il comando `git gc`.
