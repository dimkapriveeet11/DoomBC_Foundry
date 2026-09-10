# DoomBC for Foundry

Самостоятельная игровая система **DoomBC** для Foundry Virtual Tabletop.

## Архитектура

Проект больше не является модулем для Apex Heresy и не зависит от `dark-heresy`.

- Foundry package type: **Game System**
- System id: `doombc`
- Manifest: `system.json`
- Runtime entry point: `scripts/main.js`
- Основной язык разработки интерфейса: русский
- Текущая целевая версия Foundry: 14.367

Apex Heresy и старая Black Crusade Automation могут использоваться только как технические референсы. Их правила, Actor-модели и Item-модели не являются зависимостью DoomBC.

## Локальная разработка

Репозиторий рекомендуется клонировать прямо в папку систем Foundry:

```text
{Foundry User Data}/Data/systems/doombc/
```

Имя локальной папки должно совпадать с id системы: `doombc`.

После запуска пустого мира на DoomBC в консоли Foundry должны появиться:

```text
DoomBC | init
DoomBC | ready
```

GitHub используется для фиксации проверенных этапов. Основной цикл разработки: локальная правка → перезагрузка тестового мира → проверка → commit/push.

## План

См. `ROADMAP.md`.

Ближайший этап — **Phase 0: самостоятельный системный каркас**, затем **DoomBC Combat Alpha (Phase 1–4)**.

## Источники правил

См. `SOURCES.md`.

## Таланты

См. `TALENTS.md`. Таланты переносятся только после реализации базовых механик, на которые они опираются.
