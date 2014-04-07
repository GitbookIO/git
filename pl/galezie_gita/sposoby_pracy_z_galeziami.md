# Sposoby pracy z gałęziami

Teraz, kiedy poznałeś już podstawy gałęzi i scalania, co ze zdobytą wiedzą możesz i co powinieneś zrobić? W tej części zajmiemy się typowymi schematami pracy, które stają się dostępne dzięki tak lekkiemu modelowi gałęzi. Pozwoli ci to samemu zdecydować, czy warto stosować je w swoim cyklu rozwoju projektów.

## Gałęzie długodystansowe

Ponieważ Git używa prostego scalania trójstronnego, scalanie zmian z jednej gałęzi do drugiej kilkukrotnie w długim okresie czasu jest ogólnie łatwe. Oznacza to, że możesz utrzymywać kilka gałęzi, które są zawsze otwarte i których używasz dla różnych faz w cyklu rozwoju; możesz scalać zmiany regularnie z jednych gałęzi do innych.

Wielu programistów pracuje z Gitem wykorzystując to podejście, trzymając w gałęzi `master` jedynie stabilny kod — możliwe, że jedynie kod, który już został albo w najbliższej przyszłości zostanie wydany. Równolegle utrzymują oni inną gałąź o nazwie `develop` lub `next`, na której pracują lub używają jej do stabilizacji przyszłych wersji — zawarta w niej praca nie musi być zawsze stabilna, lecz po stabilizacji może być scalona do gałęzi `master`. Taką gałąź wykorzystuje się także do wciągania zmian z gałęzi tematycznych (gałęzi krótkodystansowych, takich jak wcześniejsza `iss53`), kiedy są gotowe, aby przetestować je i upewnić się, że nie wprowadzają nowych błędów.

W rzeczywistości mówimy o wskaźnikach przesuwających się w przód po zatwierdzanych przez Ciebie zestawach zmian. Stabilne gałęzie znajdują się wcześniej w historii, a gałęzie robocze na jej końcu (patrz Rysunek 3-18).


![](http://git-scm.com/figures/18333fig0318-tn.png)
 
Figure 3-18. Stabilniejsze gałęzie z reguły znajdują się wcześniej w historii zmian.

Ogólnie łatwiej jest myśleć o nich jak o silosach na zmiany, gdzie grupy zmian są promowane do stabilniejszych silosów, kiedy już zostaną przetestowane (Rysunek 3-19).


![](http://git-scm.com/figures/18333fig0319-tn.png)
 
Figure 3-19. Może być ci łatwiej myśleć o swoich gałęziach jak o silosach.

Możesz powielić ten schemat na kilka poziomów stabilności. Niektóre większe projekty posiadają dodatkowo gałąź `proposed` albo `pu` („proposed updates” — proponowane zmiany), scalającą gałęzie, które nie są jeszcze gotowe trafić do gałęzi `next` czy `master`. Zamysł jest taki, że twoje gałęzie reprezentują różne poziomy stabilności; kiedy osiągają wyższy stopień stabilności, są scalane do gałęzi powyżej.
Podobnie jak poprzednio, posiadanie takich długodystansowych gałęzi nie jest konieczne, ale często bardzo pomocne, zwłaszcza jeśli pracujesz przy dużych, złożonych projektach.

## Gałęzie tematyczne

Gałęzie tematyczne, dla odmiany, przydadzą się w każdym projekcie, niezależnie od jego rozmiarów. Gałąź tematyczna to gałąź krótkodystansowa, którą tworzysz i używasz w celu stworzenia pojedynczej funkcji lub innych tego rodzaju zmian. Z całą pewnością nie jest to coś czego chciałbyś używać pracując z wieloma innymi systemami kontroli wersji, ponieważ scalanie i tworzenie nowych gałęzi jest w nich ogólnie mówiąc zbyt kosztowne. W Gicie tworzenie, praca wewnątrz jak i scalanie gałęzi kilkukrotnie w ciągu dnia jest powszechnie stosowane i naturalne.

Widziałeś to w poprzedniej sekcji, kiedy pracowaliśmy z gałęziami `iss53` i `hotfix`. Stworzyłeś wewnątrz nich kilka rewizji, po czym usunąłeś je zaraz po scaleniu zmian z gałęzią główną. Ta technika pozwala na szybkie i efektywne przełączanie kontekstu - ponieważ Twój kod jest wyizolowany w osobnych silosach, w których wszystkie zmiany są związane z pracą do jakiej została stworzona gałąź, znacznie łatwiej jest połapać się w kodzie podczas jego przeglądu, recenzowania i temu podobnych. Możesz przechowywać tam swoje zmiany przez kilka minut, dni, miesięcy i scalać je dopiero kiedy są gotowe, bez znaczenia w jakiej kolejności zostały stworzone oraz w jaki sposób przebiegała praca nad nimi.

Rozważ przykład wykonywania pewnego zadania (na gałęzi głównej), stworzenia gałęzi w celu rozwiązania konkretnego problemu (`iss91`), pracy na niej przez chwilę, stworzenia drugiej gałęzi w celu wypróbowania innego sposobu rozwiązania tego samego problemu (`iss91v2`), powrotu do gałęzi głównej i pracy z nią przez kolejną chwilę, a następnie stworzenia tam kolejnej gałęzi do sprawdzenia pomysłu, co do którego nie jesteś pewny, czy ma on sens (gałąź `dumbidea`). Twoja historia rewizji będzie wygląda mniej więcej tak:


![](http://git-scm.com/figures/18333fig0320-tn.png)
 
Figure 3-20. Twoja historia rewizji zawierająca kilka gałęzi tematycznych.

Teraz, powiedzmy, że decydujesz się, że najbardziej podoba ci się drugie rozwiązanie Twojego problemu (`iss91v2`); zdecydowałeś się także pokazać gałąź `dumbidea` swoim współpracownikom i okazało się, że pomysł jest genialny. Możesz wyrzucić oryginalne rozwiązanie problemu znajdujące się w gałęzi `iss91` (tracąc rewizje C5 i C6) i scalić dwie pozostałe gałęzie. Twoja historia będzie wyglądać tak, jak na Rysunku 3-21.


![](http://git-scm.com/figures/18333fig0321-tn.png)
 
Figure 3-21. Historia zmian po scaleniu gałęzi dumbidea i iss91v2.

Ważne jest, żeby robiąc to wszystko pamiętać, że są to zupełnie lokalne gałęzie. Tworząc nowe gałęzie i scalając je później, robisz to wyłącznie w ramach własnego repozytorium - bez jakiejkolwiek komunikacji z serwerem.
