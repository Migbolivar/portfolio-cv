# Chinook Database — Schema Definition

## Entity Relationship Diagram

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  artist  │     │  album   │     │  track   │
│──────────│     │──────────│     │──────────│
│🔑artist_id│◄────│ artist_id│◄────│ album_id │
│ name     │     │🔑album_id │     │ media_type│──┐
└──────────┘     │ title    │     │ genre_id │──┐│
                 └──────────┘     │ composer │  ││
                                  │ ms       │  ││
┌──────────┐     ┌──────────┐     │ bytes    │  ││
│ playlist │     │playlist_tr│    │ unit_price│  ││
│──────────│     │──────────│     │🔑track_id │  ││
│🔑playlist│◄────│playlist_id│    └────┬─────┘  ││
│ name     │     │🔑track_id │─────────┘        ││
└──────────┘     └──────────┘                   ││
                                                 ││
┌──────────┐     ┌──────────┐     ┌──────────┐  ││
│ genre    │     │media_type│     │invoice_ln│  ││
│──────────│     │──────────│     │──────────│  ││
│🔑genre_id│◄────┘          │◄────┘🔑inv_line│  ││
│ name     │     │🔑media_id│     │ invoice_id│──┐│
└──────────┘     │ name     │     │ track_id  │  ││
                 └──────────┘     │ unit_price│  ││
                                  │ quantity  │  ││
┌──────────┐     ┌──────────┐     └──────────┘  ││
│ employee │     │ customer │                     ││
│──────────│     │──────────│     ┌──────────┐  ││
│🔑emp_id  │◄────│support_rep│    │ invoice  │  ││
│ name     │     │🔑cust_id │     │──────────│  ││
│ title    │     │ name     │     │🔑inv_id  │◄─┘│
└──────────┘     │ country  │     │ cust_id  │────┘
                 └──────────┘     │ inv_date │
                                  │ total    │
                                  └──────────┘
```

## Tablas (11 total, 4,757 fact rows)

| # | Tabla | Rows | Tipo | Descripción |
|---|-------|------|------|-------------|
| 1 | artist | 275 | Dimension | Artistas musicales |
| 2 | album | 347 | Dimension | Álbumes |
| 3 | track | 3,503 | Dimension | Canciones/tracks |
| 4 | genre | 25 | Dimension | Géneros musicales |
| 5 | media_type | 5 | Dimension | Tipos de medio (MP3, AAC, etc.) |
| 6 | playlist | 18 | Dimension | Playlists |
| 7 | playlist_track | 8,715 | Bridge | Relación M:N playlist↔track |
| 8 | customer | 59 | Dimension | Clientes |
| 9 | employee | 8 | Dimension | Empleados |
| 10 | invoice | 614 | Fact | Facturas/órdenes |
| 11 | invoice_line | 4,757 | Fact | Líneas de factura (detalle) |

## Relaciones Clave

- `artist` → `album` → `track` (jerarquía musical)
- `track` → `invoice_line` ← `invoice` ← `customer` (ventas)
- `customer` → `employee` (representante de soporte)
- `track` → `genre`, `track` → `media_type` (clasificación)
- `playlist` ↔ `playlist_track` ↔ `track` (playlists)
