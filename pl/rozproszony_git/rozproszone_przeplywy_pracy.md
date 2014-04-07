# Rozproszone przepływy pracy

Odmiennie do scentralizowanych systemów kontroli wersji (CVCS), rozproszona natura systemu Git pozwala na dużo bardziej elastyczne podejście do tego w jaki sposób przebiega współpraca między programistami. W scentralizowanych systemach każdy programista jest osobnym elementem pracującym na centralnym serwerze. W Gitcie każdy programista posiada zarówno swoje oddzielne repozytorium, które może zostać udostępnione dla innych, jak również centralny serwer do którego inni mogą wgrywać swoje zmiany. To umożliwia szerokie możliwości współpracy dla Twojego projektu i/lub zespołu, dlatego opiszę kilka często używanych zachować które z tego korzystają. Pokażę zalety i wady każdego z rozwiązań; możesz wybrać jeden odpowiadający tobie, lub możesz je połączyć i zmieszać ze sobą.

## Scentralizowany przepływ pracy

W scentralizowanych systemach, zazwyczaj jest stosowany model centralnego przepływu. W jednym centralnym punkcie znajduje się repozytorium, do którego wgrywane są zmiany, a pozostali współpracownicy synchronizują swoją pracę z nim. Wszyscy programiści uczestniczący w projekcie są końcówkami, łączącymi się z centralnym serwerem - oraz synchronizującymi się z nim (patrz rys. 5-1 )

<!-- In centralized systems, there is generally a single collaboration model—the centralized workflow. One central hub, or repository, can accept code, and everyone synchronizes their work to it. A number of developers are nodes — consumers of that hub — and synchronize to that one place (see Figure 5-1). -->


![](http://git-scm.com/figures/18333fig0501-tn.png)

Figure 5-1. Scentralizowany przepływ pracy.

Oznacza to tyle, że w sytuacji w której dwóch niezależnych programistów korzystających z tego centralnego repozytorium będzie próbowało wgrać swoje zmiany, tylko pierwszemu z nich uda się tego dokonać bezproblemowo. Drugi przed wgraniem, będzie musiał najpierw pobrać i zintegrować zmiany wprowadzone przez pierwszego programistę, a dopiero później ponowić próbę wysłania swoich na serwer. Taki rodzaj współpracy sprawdza się doskonale w Gitcie, tak samo jak funkcjonuje on w Subversion (lub każdym innym CVCS).

Jeżeli masz mały zespół, lub dobrze znacie pracę z jednym centralnym repozytorium w firmie lub zespole, możesz bez problemów kontynuować ten rodzaj pracy z Gitem. Po prostu załóż nowe repozytorium, nadaj każdej osobie z zespołu uprawnienia do wgrywania zmian (za pomocą komendy `push`); Git nie pozwoli na nadpisanie pracy jednego programisty przez innego. Jeżeli jeden z programistów sklonuje repozytorium, wprowadzi zmiany i będzie próbował wgrać je do głównego repozytorium, a w międzyczasie inny programista wgra już swoje zmiany, serwer odrzuci jego zmiany. Zostaną poinformowani że próbują wgrać zmiany (tzw. non-fast-forward) i że muszą najpierw pobrać je (fetch) i włączyć do swojego repozytorium (merge). Taki rodzaj współpracy jest atrakcyjny dla dużej ilości osób, ponieważ działa w taki sposób, w jaki przywykli oni pracować.

<!-- If you have a small team or are already comfortable with a centralized workflow in your company or team, you can easily continue using that workflow with Git. Simply set up a single repository, and give everyone on your team push access; Git won’t let users overwrite each other. If one developer clones, makes changes, and then tries to push their changes while another developer has pushed in the meantime, the server will reject that developer’s changes. They will be told that they’re trying to push non-fast-forward changes and that they won’t be able to do so until they fetch and merge.
This workflow is attractive to a lot of people because it’s a paradigm that many are familiar and comfortable with. -->

## Przepływ pracy z osobą integrującą zmiany


Ponieważ Git powala na posiadanie wielu zdalnych repozytoriów, możliwy jest schemat pracy w którym każdy programista ma uprawnienia do zapisu do swojego własnego repozytorium oraz uprawnienia do odczytu do repozytorium innych osób w zespole. Ten scenariusz często zawiera jedno centralne - "oficjalne" repozytorium projektu. Aby wgrać zmiany do projektu, należy stworzyć publiczną kopię tego repozytorium i wgrać ("push") zmiany do niego. Następnie należy wysłać prośbę do opiekuna aby pobrał zmiany do głównego repozytorium. Może on dodać Twoje repozytorium jako zdalne, przetestować Twoje zmiany lokalnie, włączyć je do nowej gałęzi i następnie wgrać do repozytorium. Proces ten wygląda następująco (rys. 5-2):

<!-- Because Git allows you to have multiple remote repositories, it’s possible to have a workflow where each developer has write access to their own public repository and read access to everyone else’s. This scenario often includes a canonical repository that represents the "official" project. To contribute to that project, you create your own public clone of the project and push your changes to it. Then, you can send a request to the maintainer of the main project to pull in your changes. They can add your repository as a remote, test your changes locally, merge them into their branch, and push back to their repository. The process works as follow (see Figure 5-2): -->

1. Opiekun projektu wgrywa zmiany do publicznego repozytorium.
2. Programiści klonują to repozytorium i wprowadzają zmiany.
3. Programista wgrywa zmiany do swojego publicznego repozytorium.
4. Programista wysyła prośbę do opiekuna projektu, aby pobrał zmiany z jego repozytorium.
5. Opiekun dodaje repozytorium programisty jako repozytorium zdalne i pobiera zmiany.
6. Opiekun wgrywa włączone zmiany do głównego repozytorium.

<!--
1. The project maintainer pushes to their public repository.
2. A contributor clones that repository and makes changes.
3. The contributor pushes to their own public copy.
4. The contributor sends the maintainer an e-mail asking them to pull changes.
5. The maintainer adds the contributor’s repo as a remote and merges locally.
6. The maintainer pushes merged changes to the main repository.
-->


![](http://git-scm.com/figures/18333fig0502-tn.png)

Figure 5-2. Przepływ pracy z osobą integrującą zmiany.

To jest bardzo popularne podejście podczas współpracy przy pomocy stron takich jak GitHub, gdzie bardzo łatwo można stworzyć kopię repozytorium i wgrywać zmiany do niego aby każdy mógł je zobaczyć. jedną z głównych zalet takiego podejścia jest to, że możesz kontynuować pracę, a opiekun może pobrać Twoje zmiany w dowolnym czasie. Programiści nie muszą czekać na opiekuna, aż ten włączy ich zmiany, każdy z nich może pracować oddzielnie.

<!-- This is a very common workflow with sites like GitHub, where it’s easy to fork a project and push your changes into your fork for everyone to see. One of the main advantages of this approach is that you can continue to work, and the maintainer of the main repository can pull in your changes at any time. Contributors don’t have to wait for the project to incorporate their changes — each party can work at their own pace. -->

## Przepływ pracy z dyktatorem i porucznikami

To jest wariant przepływu z wieloma repozytoriami. Zazwyczaj jest on używany w bardzo dużych projektach, z setkami programistów; najbardziej znanym przykładem może być jądro Linuksa. Kilkoro opiekunów jest wydelegowanych do obsługi wydzielonych części repozytorium; nazwijmy ich porucznikami. Wszyscy z nich mają jedną, główną osobę integrującą zmiany - znaną jako miłościwy dyktator. Repozytorium dyktatora jest wzorcowym, z którego wszyscy programiści pobierają zmiany. Cały proces działa następująco (rys. 5-3):

<!-- This is a variant of a multiple-repository workflow. It’s generally used by huge projects with hundreds of collaborators; one famous example is the Linux kernel. Various integration managers are in charge of certain parts of the repository; they’re called lieutenants. All the lieutenants have one integration manager known as the benevolent dictator. The benevolent dictator’s repository serves as the reference repository from which all the collaborators need to pull. The process works like this (see Figure 5-3): -->


1. Programiści pracują nad swoimi gałęziami tematycznymi, oraz wykonują "rebase" na gałęzi "master". Gałąź "master" jest tą pobraną od dyktatora.
2. Porucznicy włączają ("merge") zmiany programistów do swojej gałęzi "master".
3. Dyktator włącza ("merge") gałęzie "master" udostępnione przez poruczników do swojej gałęzi "master".
4. Dyktator wypycha ("push") swoją gałąź master do głównego repozytorium, tak aby inni programiści mogli na niej pracować.

<!--
1. Regular developers work on their topic branch and rebase their work on top of master. The master branch is that of the dictator.
2. Lieutenants merge the developers’ topic branches into their master branch.
3. The dictator merges the lieutenants’ master branches into the dictator’s master branch.
4. The dictator pushes their master to the reference repository so the other developers can rebase on it.
-->


![](http://git-scm.com/figures/18333fig0503-tn.png)

Figure 5-3. Przepływ pracy z miłościwym dyktatorem.

Ten rodzaj współpracy nie jest częsty w użyciu, ale może być użyteczny w bardzo dużych projektach, lub bardzo rozbudowanych strukturach zespołów w których lider zespołu może delegować większość pracy do innych i zbierać duże zestawy zmian przed integracją.

<!-- This kind of workflow isn’t common but can be useful in very big projects or in highly hierarchical environments, as it allows the project leader (the dictator) to delegate much of the work and collect large subsets of code at multiple points before integrating them. -->

To są najczęściej stosowane przepływy pracy możliwe przy użyciu rozproszonego systemu takiego jak Git, jednak możesz zauważyć że istnieje w tym względzie duża dowolność, tak abyś mógł dostosować go do używanego przez siebie tryby pracy. Teraz gdy (mam nadzieję) możesz już wybrać sposób pracy który jest dla Ciebie odpowiedni, pokaże kilka konkretnych przykładów w jaki sposób osiągnąć odpowiedni podział ról dla każdego z opisanych przepływów.

<!-- These are some commonly used workflows that are possible with a distributed system like Git, but you can see that many variations are possible to suit your particular real-world workflow. Now that you can (I hope) determine which workflow combination may work for you, I’ll cover some more specific examples of how to accomplish the main roles that make up the different flows. -->
