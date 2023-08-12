const container = document.querySelector(".container");
const disallowedKeyCodes = [69, 107, 109, 187, 189, 190];
const lifts = [];

document
  .getElementById("numberOfFloors")
  .addEventListener("input", preventExponents);
document
  .getElementById("numberOfLifts")
  .addEventListener("input", preventExponents);
document.getElementById("startButton").addEventListener("click", handleOnClick);

window.addEventListener("load", function () {
  if (localStorage.getItem("noOfFloors") && localStorage.getItem("noOfLifts")) {
    const totalNumberOfFloors = localStorage.getItem("noOfFloors");
    const totalNumberOfLifts = localStorage.getItem("noOfLifts");
    populateFloors(totalNumberOfFloors, totalNumberOfLifts);
  }

  for (const lift of lifts) {
    const currentFloor = localStorage.getItem(lift.id);

    if (currentFloor) {
      const liftMovement =
        window.innerWidth > 600
          ? -11 * (currentFloor - 1) + currentFloor * 0.2 + "rem"
          : -(currentFloor - 1) * 14 - (currentFloor - 2) * 0.2 + "rem";
      lift.style.transform = `translateY(${liftMovement})`;
      lift.setAttribute("name", currentFloor);
    }
  }
});

function preventExponents(event) {
  const keyCode = event.which ? event.which : event.keyCode;
  const inputValue = event.target.value;

  if (
    disallowedKeyCodes.includes(keyCode) ||
    inputValue.includes("e") ||
    inputValue.includes("E")
  ) {
    event.preventDefault();
  }
}

function handleOnClick() {
  const totalNumberOfFloors = document.getElementById("numberOfFloors").value;
  const totalNumberOfLifts = document.getElementById("numberOfLifts").value;

  if (totalNumberOfFloors === "" || totalNumberOfLifts === "") {
    alert("Enter both fields!");
  } else {
    localStorage.setItem("noOfFloors", totalNumberOfFloors);
    localStorage.setItem("noOfLifts", totalNumberOfLifts);
    populateFloors(totalNumberOfFloors, totalNumberOfLifts);
  }
}

function goBack() {
  localStorage.clear();
  location.reload();
}

function populateFloors(totalFloors, totalLifts) {
  container.innerHTML =
    "<button class='backBtn' onclick={goBack()}>	&lt; Back</button>";

  for (let i = totalFloors; i >= 1; i--) {
    const buttonsHtml =
      i === totalFloors
        ? `<div class="buttons"><button onclick="move(this, 'up')" name="${i}" class="btn down">Down</button></div>`
        : i === 1
        ? `<div class="buttons">
           <button onclick="move(this, 'down')" name="${i}" class="btn up">Up</button>
         </div>`
        : `<div class="buttons">
         <button onclick="move(this, 'up')" name="${i}" class="btn up">Up</button>
         <button onclick="move(this, 'down')" name="${i}" class="btn down">Down</button>
       </div>`;

    const liftContainerHtml =
      i === 1
        ? `<div class="lift-container">${generateLiftsHtml(totalLifts)}</div>`
        : `<div class="lift-container"></div>`;

    const floorHtml = `
      <div class="floor">
        <div class="flex-container">
          ${buttonsHtml}
          ${liftContainerHtml}
        </div>
        <hr class="line" />
        <span class="floor-name">Floor ${i}</span>
      </div>`;

    container.innerHTML += floorHtml;
  }

  lifts.push(...document.querySelectorAll(".lift"));
}

function generateLiftsHtml(totalLifts) {
  return Array.from(
    { length: totalLifts },
    (_, i) => `<div class="lift" name="1" id="lift${i + 1}"></div>`
  ).join("");
}

function move(button, direction) {
  const targetFloor = parseInt(button.name);
  const liftMovement =
    window.innerWidth > 600
      ? -11 * (targetFloor - 1) + targetFloor * 0.2 + "rem"
      : -(targetFloor - 1) * 14 - (targetFloor - 2) * 0.2 + "rem";

  for (const lift of lifts) {
    const currentFloor = parseInt(lift.getAttribute("name"));

    if (
      (direction === "up" && currentFloor < targetFloor) ||
      (direction === "down" && currentFloor > targetFloor)
    ) {
      lift.style.transform = `translateY(${liftMovement})`;
      lift.setAttribute("name", targetFloor);
      localStorage.setItem(lift.id, targetFloor);
      break;
    }
  }
}
