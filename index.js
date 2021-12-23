// A 25 + 5 Clock made with React
const formatTime = (time) => {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${minutes}:${seconds}`;
};

function Clock() {
  const [displayTime, setDisplayTime] = React.useState(25 * 60);
  const [breakTime, setBreakTime] = React.useState(5 * 60);
  const [sessionTime, setSessionTime] = React.useState(25 * 60);
  const [isRunning, setIsRunning] = React.useState(false);
  const [isBreak, setIsBreak] = React.useState(false);

  const playSound = () => {
    const audio = document.getElementById("beep");
    audio.currentTime = 0;
    audio.play();
  };

  const changeTime = (amount, type) => {
    if (type === "default") {
      const audio = document.getElementById("beep");
      audio.currentTime = 0;
      audio.pause();
      setSessionTime(25 * 60);
      setDisplayTime(25 * 60);
      setBreakTime(5 * 60);
      setIsRunning(false);
      setIsBreak(false);
      clearInterval(localStorage.getItem("interval"));
      localStorage.clear();
      return;
    }
    if (isRunning) return;
    if (type === "session") {
      if (sessionTime + amount <= 0 || sessionTime + amount > 60 * 60) return;
      setSessionTime(sessionTime + amount);
      setDisplayTime(displayTime + amount);
    } else {
      if (breakTime + amount <= 0 || breakTime + amount > 60 * 60) return;
      setBreakTime(breakTime + amount);
    }
  };

  const controlTime = () => {
    let date = new Date().getTime(),
      nextDate = new Date().getTime() + 1000,
      breakVariable = isBreak;

    if (!isRunning) {
      let interval = setInterval(() => {
        date = new Date().getTime();
        if (date > nextDate) {
          setDisplayTime((a) => {
            if (a <= 0 && breakVariable) {
              playSound();
              breakVariable = false;
              setIsBreak(false);
              return sessionTime;
            } else if (a <= 0 && !breakVariable) {
              playSound();
              breakVariable = true;
              setIsBreak(true);
              return breakTime;
            }
            return a - 1;
          });
          nextDate += 1000;
        }
      }, 30);
      localStorage.clear();
      localStorage.setItem("interval", interval);
    } else {
      clearInterval(localStorage.getItem("interval"));
    }
    setIsRunning(!isRunning);
  };

  return (
    <div>
      <audio id="beep" src="./beep.wav"></audio>
      <h1 class="center-align">Pomodoro Clock</h1>
      <div class="time-sets row">
        <Length
          title="Break Time"
          type="break"
          time={breakTime}
          changeTime={changeTime}
        />
        <div></div>
        <Length
          title="Session Time"
          type="session"
          time={sessionTime}
          changeTime={changeTime}
        />
      </div>
      <div class="container time-display center-align">
        <h2 id="timer-label">{isBreak ? "Break" : "Session"}</h2>
        <h3 id="time-left">{formatTime(displayTime)}</h3>
        <div class="control">
          <button
            class="btn-small purple lighten-2"
            onClick={controlTime}
            id="start_stop"
          >
            <i class="material-icons">{isRunning ? "pause" : "play_arrow"}</i>
          </button>
          <button
            class="btn-small red"
            onClick={() => changeTime(null, "default")}
            id="reset"
          >
            <i class="material-icons">repeat</i>
          </button>
        </div>
      </div>
    </div>
  );
}

function Length({ title, type, time, changeTime }) {
  return (
    <div class="col s6">
      <h4 class="center-align" id={`${type}-label`}>
        {title}
      </h4>
      <div class="valign-wrapper container row" id="buttons">
        <button
          class="btn-small indigo lighten-2 col"
          onClick={() => changeTime(-60, type)}
          id={`${type}-decrement`}
        >
          <i class="material-icons">arrow_downward</i>
        </button>
        <h5 class="col" id={`${type}-length`}>
          {Math.floor(time / 60)}
        </h5>
        <button
          class="btn-small indigo lighten-2 col"
          onClick={() => changeTime(60, type)}
          id={`${type}-increment`}
        >
          <i class="material-icons">arrow_upward</i>
        </button>
      </div>
    </div>
  );
}

ReactDOM.render(<Clock />, document.getElementById("root"));
