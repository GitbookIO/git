# Sanitaire voorzieningen en porselein

In dit boek wordt Git met ongeveer 30 werkwoorden zoals `checkout`, `branch`, `remote` enzovoorts behandeld. Maar omdat Git in eerste instantie een toolkit voor een VCS was, in plaats van een volledig gebruiksvriendelijk VCS, heeft het een berg werkwoorden die laag-bij-de-gronds werk doen en ontworpen waren om gebruikt te worden zoals in UNIX gebruikelijk is, of vanuit scripts aangeroepen te worden. Naar deze commando's wordt over het algemeen als "plumbing" (sanitaire voorzieningen) commando's gerefereerd, en de meer gebruiksvriendelijke commando's worden "porcelain" (porselein) commando's genoemd.

In de eerste acht hoofdstukken van het boek worden bijna alleen de porcelain commando's behandeld. Maar in dit hoofdstuk zal je het meest met het laagste niveau van de plumbing commando's te maken gaan krijgen. Zij geven je toegang tot het binnenwerk van Git, en laten zien hoe en waarom Git doet wat het doet. Deze commando's zijn niet bedoeld voor normaal gebruik op de commandoregel, maar meer om als bouwstenen voor nieuwe tools en zelfgemaakte scripts gebruikt te worden.

Als je `git init` uitvoert in een nieuwe of bestaande directory, zal Git de directory `.git` aanmaken, wat de plaats is waar bijna alles wordt bewaard wat Git opslaat en manipuleert. Als je een backup of kopie van je repository wilt maken, dan hoef je alleen maar die directory te kopiëren, en je hebt bijna alles wat je nodig hebt. Dit hele hoofdstuk gaat in essentie over de inhoud van deze directory. Hier zie je hoe het eruit ziet:

	$ ls
	HEAD
	branches/
	config
	description
	hooks/
	index
	info/
	objects/
	refs/

Je zou hier een paar andere bestanden kunnen zien, maar dit is een verse `git init` repository - dit is wat je standaard ziet. De `branches` directory wordt niet gebruikt door nieuwere Git versies, en het `description` bestand wordt alleen gebruikt door het programma GitWeb, dus je hoeft je daar geen zorgen over te maken. Het bestand `config` bevat je project-specifieke configuratieopties, en de `info` directory bevat een bestand met bestandsnaampatronen die je niet wilt volgen, maar die je niet wilt opnemen in een .gitignore bestand. De directory `hooks` bevat scripts die aan bepaalde acties zijn “gehaakt” aan client- en serverkant, deze zijn in detail behandeld in Hoofdstuk 7.

Dit laat vier belangrijke vermeldingen over: de bestanden `HEAD` en `index`, en de directories `objects` en `refs`. Dit zijn de kernbestanddelen van Git. De directory `objects` bevat alle inhoud van je databank, de directory `refs` bevat verwijzingen naar commitobjecten (branches) in die databank, het bestand `HEAD` wijst naar de branch die je op dit moment uitgecheckt hebt, en het bestand `index` is waar Git de informatie van je staging area (wachtrij) opslaat. We gaan nu gedetaileerd naar elk van deze onderdelen kijken om te laten zien hoe Git werkt.
