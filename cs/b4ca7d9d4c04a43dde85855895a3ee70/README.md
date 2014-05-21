# Git pod pokličkou

Ať už jste do této kapitoly přeskočili z některé z předchozích, nebo jste se sem pročetli napříč celou knihou, v této kapitole se dozvíte něco o vnitřním fungování a implementaci systému Git. Osobně se domnívám, že je tato informace velmi důležitá, aby uživatel pochopil, jak užitečný a výkonný je systém Git. Ostatní mi však oponovali, že pro začátečníky mohou být tyto informace matoucí a zbytečně složité. Proto jsem tyto úvahy shrnul do poslední kapitoly knihy, kterou si můžete přečíst v libovolné fázi seznamování se systémem Git. Vhodný okamžik záleží jen na vás.

Nyní se však už pusťme do práce. Pokud tato informace ještě nezazněla dostatečně jasně, můžeme začít konstatováním, že Git je ve své podstatě obsahově adresovatelný systém souborů s uživatelským rozhraním VCS na svém vrcholu. Tomu, co tato definice znamená, se budeme věnovat za chvíli.

V dávných dobách (zhruba do verze 1.5) bývalo uživatelské rozhraní systému Git podstatně složitější než dnes. Git tehdy spíš než na uhlazené VCS kladl důraz právě na systém souborů. Uživatelské rozhraní však bylo za několik posledních let zkultivováno a dnes je už velmi čisté a uživatelsky příjemné. Ani v tomto ohledu se tak už Git nemusí obávat srovnání s ostatními systémy, navzdory tomu, že přetrvávající předsudky z raných dob hodnotí jeho uživatelské prostředí jako komplikované a náročné na pochopení.

Na systému Git je skvělý jeho obsahově adresovatelný systém souborů, a proto se v této kapitole zaměřím nejprve na něj. Poté se podíváme na mechanismy přenosu a úkony správy repozitářů, s nimiž se můžete jednou setkat.
