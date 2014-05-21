# Mechanizmy wewnętrzne w Git

<!-- # Git Internals -->

Być może przeskoczyłeś do tego rozdziału z poprzedniego, lub dotarłeś aż dotąd po przeczytaniu reszty książki - w każdym z tych przypadków, dowiesz się tutaj o tym w jaki sposób pracują wewnętrzne mechanizmy i ich implementacja w Git. Wiem, jak ważne jest poznanie tych rzeczy, aby zrozumieć jak przydatnym i potężnym narzędziem jest Git, jednak niektóre osoby wskazywały że może to wprowadzać zamieszanie i niepotrzebnie komplikować sprawy dla początkujących użytkowników. Dlatego zawarłem te informacje w ostatnim rozdziale w książce, tak abyś mógł go przeczytać w dowolnym momencie nauki. Decyzję zostawiam Tobie.

<!-- You may have skipped to this chapter from a previous chapter, or you may have gotten here after reading the rest of the book — in either case, this is where you’ll go over the inner workings and implementation of Git. I found that learning this information was fundamentally important to understanding how useful and powerful Git is, but others have argued to me that it can be confusing and unnecessarily complex for beginners. Thus, I’ve made this discussion the last chapter in the book so you could read it early or later in your learning process. I leave it up to you to decide. -->

Teraz, gdy jesteś już tutaj, rozpocznijmy. Po pierwsze, jeżeli nie jest to jeszcze jasne, podstawą Gita jest systemem plików ukierunkowanym na treść, z nałożonym interfejsem użytkownika obsługującym kontrolę wersji (VCS). Dowiesz się co to oznacza za chwilę.

<!-- Now that you’re here, let’s get started. First, if it isn’t yet clear, Git is fundamentally a content-addressable filesystem with a VCS user interface written on top of it. You’ll learn more about what this means in a bit. -->

We wczesnych fazach Gita (głównie przed wersją 1.5), interfejs użytkownika był dużo bardziej skomplikowany, ponieważ kładł nacisk na sam system plików, a nie funkcjonalności VCS. W ciągu ostatnich kilku lat, interfejs został dopracowany i jest teraz tak łatwy jak inne; jednak często pokutuje stereotyp na temat pierwszych wersji UI, które były skomplikowane i trudne do nauczenia.

<!-- In the early days of Git (mostly pre 1.5), the user interface was much more complex because it emphasized this filesystem rather than a polished VCS. In the last few years, the UI has been refined until it’s as clean and easy to use as any system out there; but often, the stereotype lingers about the early Git UI that was complex and difficult to learn. -->

Warstwa systemu plików jest zadziwiająco fajna, dlatego właśnie ją opiszę w tym rozdziale; następnie, nauczysz się na temat protokołów transportowych oraz zadań związanych z obsługą repozytorium z którymi być może będziesz miał do czynienia.

<!-- The content-addressable filesystem layer is amazingly cool, so I’ll cover that first in this chapter; then, you’ll learn about the transport mechanisms and the repository maintenance tasks that you may eventually have to deal with. -->
