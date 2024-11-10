# Developer setup

Em um terminal:

git clone https://github.com/LuizBudeu/logic-gates.git

cd logic-gates

python -m venv env

/env/Scripts/Activate.ps1

pip install -r requirements.txt

cd server

python manage.py runserver

Outro terminal:

cd front

npm install

Adicionar o `.env` em `./front`

adicione `REACT_APP_API_HOSTNAME_PORT="http://127.0.0.1:8000"` ao `.env`

npm start

Utilização:

Backend API em `http://127.0.0.1:8000/`

Frontend em `http://localhost:3000/`

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
-- fix bug: when deleting wire from connection, present IO state persists
-- name circuit
-- add possibilty of many global inputs and outputs (and gates')
-- save current circuit to gate
-- fix multipurpose getSavedGatesFromLocalStorage
-- fix cumulative code
-- fix clearing circuit on succesfull save
-- proof adder
-- make button to completely clear localStorage

-   add logic of multiple outputs/inputs to gates
-   prohibit downstream IOs to have more than one connection
-   add logic to delete savedGate from localStorage

-   fix bug: spawn two gates in sequence, separate them, delete the first gate and the second will also get deleted incorrectly (for some reason if (this.ctx.isPointInPath(mousePos.x, mousePos.y)) is entering for second gate (todo: search better how this function works))
-   fix bug: when reseting localStorage, first placed NAND won't compute properly, only on refresh does it work
-   fix window resizing issues
-   updat Rect, Circle classes to use new Mouse
