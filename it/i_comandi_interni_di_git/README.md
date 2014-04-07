# I comandi interni di Git

Forse sei saltato a questo capitolo da uno precedente, o dopo aver letto il resto del libro. In ogni caso qui approfondiremo il funzionamento interno e l'implementazione di Git. Ho pensato che queste informazioni fossero fondamentali per capire quanto Git fosse utile e potente, ma qualcuno ha argomentato che queste potessero essere complesse e non necessariamente utili per i principianti.
Per questo motivo ho deciso di includere queste informazioni nell'ultimo capitolo del libro di modo che la possa leggere nella fase dell'apprendimento che ritieni più opportuna. Lascio a te la scelta.

Dato che sei qui, possiamo partire. Per prima cosa, se non è ancora chiaro, Git è fondamentalmente un filesystem indirizzabile per contenuto sul quale si appoggia una interfaccia utente VCS. Tra breve imparerai meglio cosa significhi.

Nelle prime versioni di Git (principalmente pre 1.5) l'interfaccia utente era molto più complessa perché veniva privilegiato il filesystem rispetto ad avere un VCS pulito. Negli ultimi anni l'interfaccia utente è stata rifinita fino a diventare chiara e facile da usare come gli altri sistemi disponibili, ma è rimasto lo stereotipo che l'interfaccia di Git sia complessa e difficile da capire.

Il filesystem indirizzabile per contenuto è veramente formidabile, quindi in questo capitolo inizierò parlandone. Imparerai quindi il meccanismo di trasporto e le attività per la manutenzione del repository con le potresti dover aver a che fare.
