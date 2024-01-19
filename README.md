# Logic Gates

Visualization engine for simple logic gates circuits

TODO:

-- in addWiring: fix this.getIdByGameObject(io1); returning undefined beacuse we didn't add gate IOs to gameObjectsMap
-- can connect multiple wires to IOs and should propagate to all of them (next step)
-- move wires when moving gate
-- populate toolbox with saved gates
-- fix: when connecting wire to output, propagate immediatelly
-- fix not perfect alignment of IOs (using Settings.CANVAS_WIDTH/HEIGTH)
-- add possibility of removing gates, wiring, etc.
-- buttons visuals
-- change cursor to trash when deleting
-- rework IO connections to be upstream and downstream
-- fix bug: when connecting wire from gate Input to Global Input, gate Input overrides Global Input

-   fix bug: when deleting wire from connection, present IO state persists
-   save current circuit to gate
-   name circuit
-   make many wiring attachments possible

-   fix bug: spawn two gates in sequence, separate them, delete the first gate and the second will also get deleted incorrectly (for some reason if (this.ctx.isPointInPath(mousePos.x, mousePos.y)) is entering for second gate (todo: search better how this function works))
-   fix window resizing issues
-   updat Rect, Circle classes to use new Mouse
