import React, { useEffect, useState } from "react";
import Typewriter from "typewriter-effect/dist/core";
import profileAvatar from "../asset/logo.png";
import PersonalData from "../../Data/PersonalData";
import classes from "./home.module.css";
import { autoTypeData } from "../../Data/PersonalData";

import SocialLinks from "../SocialLinks/SocialLinks";
import { useSelector } from "react-redux";
import $ from "../../record_jquery";
import PlayButton from "../UI/play.button";
// import $ from "../../record_jquery";
// const linkIcons=[GitHubIcon,LinkedInIcon,TwitterIcon,InstagramIcon,EmailIcon];

function Home(props) {
  console.log("HOME component build");
  // config
  const REPLAY_SCALE = 0.631;
  const SPEED = 0.5;

  const recording = { events: [], startTime: -1, htmlCopy: "" };
  //   let isRecording = false;
  const $body = $("body");
  const handlers = [
    {
      eventName: "mousemove",
      handler: function handleMouseMove(e) {
        console.log("Mouse move is called");
        recording.events.push({
          type: "mousemove",
          x: e.pageX,
          y: e.pageY,
          time: Date.now(),
        });
        console.log("Recording state is :");
        console.log(recording);
      },
    },
    {
      eventName: "click",
      handler: function handleClick(e) {
        console.log("mouse click is called");

        recording.events.push({
          type: "click",
          target: e.target,
          x: e.pageX,
          y: e.pageY,
          time: Date.now(),
        });
        console.log("Recording state is :");
        console.log(recording);
      },
    },
    {
      eventName: "keypress",
      handler: function handleKeyPress(e) {
        console.log("Keypress i scalled");
        console.log("Recording state is :");
        console.log(recording);
        recording.events.push({
          type: "keypress",
          target: e.target,
          value: e.target.value,
          keyCode: e.keyCode,
          time: Date.now(),
        });
        console.log("Recording state is :");
        console.log(recording);
      },
    },
  ];

  // const [isRecording, setIsRecording] = useState(false);
  let isRecording = false;
  const nonThemeColor = useSelector((state) => state.nonThemeColor);
  const uiColor = useSelector((state) => state.uiColor);
  function handleTyper() {
    let textItems = autoTypeData;
    var autoTyper = document.getElementById("typer");
    new Typewriter(autoTyper, {
      strings: textItems,
      autoStart: true,
      pauseFor: 1000,
      loop: true,
    });
  }
  function listen(eventName, handler) {
    // listens even if stopPropagation
    console.log("LIsten function called");

    return document.documentElement.addEventListener(eventName, handler, true);
  }
  function removeListener(eventName, handler) {
    console.log("Remove listener function called.");
    // removes listen even if stopPropagation
    return document.documentElement.removeEventListener(
      eventName,
      handler,
      true
    );
  }
  function addListener(element, event, logic) {
    element.addEventListener(event, logic());
  }
  function flashClass($el, className) {
    $el
      .addClass(className)
      .delay(200)
      .queue(() => $el.removeClass(className).dequeue());
  }
  const handleIsRecording = (event) => {
    // console.log("THis is ithe winfdown");
    // console.log(window.jQuery);
    console.log(`Recording is : `);
    console.log(recording);
    isRecording = !isRecording;
    // setIsRecording(!isRecording);
    if (isRecording) {
      console.log("Starts Recording...");
      // start recording
      //   $record.text("Recording (Click again to Stop)");
      //   $play.attr("disabled", 1);
      // console.log("This is the click event");
      // console.log(event);
      recording.startTime = Date.now();
      recording.events = [];
      recording.htmlCopy = $(document.documentElement).html();
      recording.height = $(window).height();
      recording.width = $(window).width();
      handlers.map((x) => listen(x.eventName, x.handler));
      // console.log(`WINdow heithg ${recording.height}`);
    } else {
      // console.log("Stored array is :");
      // console.log(recording);
      console.log("Stopped Recording...");
      handlers.map((x) => removeListener(x.eventName, x.handler));
    }
  };
  function drawEvent(event, $fakeCursor, $iframeDoc) {
    if (event.type === "click" || event.type === "mousemove") {
      $fakeCursor.css({
        top: event.y,
        left: event.x,
      });
    }

    if (event.type === "click") {
      flashClass($fakeCursor, "click");
      const path = $(event.target).getPath();
      const $element = $iframeDoc.find(path);
      flashClass($element, "clicked");
    }

    if (event.type === "keypress") {
      const path = $(event.target).getPath();
      const $element = $iframeDoc.find(path);
      $element.trigger({ type: "keypress", keyCode: event.keyCode });
      $element.val(event.value);
    }
  }
  const handlePlay = (event) => {
    // init iframe set scale
    const $iframe = $("<iframe>");
    $iframe.height(recording.height * REPLAY_SCALE);
    $iframe.width(recording.width * REPLAY_SCALE);
    $iframe.css({
      "-ms-zoom": `${REPLAY_SCALE}`,
      "-moz-transform": `scale(${REPLAY_SCALE})`,
      "-moz-transform-origin": `0 0`,
      "-o-transform": `scale(${REPLAY_SCALE})`,
      "-o-transform-origin": `0 0`,
      "-webkit-transform": `scale(${REPLAY_SCALE})`,
      "-webkit-transform-origin": `0 0`,
    });
    $body.append($iframe);

    // Load HTML
    $iframe[0].contentDocument.documentElement.innerHTML = recording.htmlCopy;
    const $iframeDoc = $($iframe[0].contentDocument.documentElement);

    // Insert fake cursor
    const $fakeCursor = $('<div class="cursor"></div>');
    $iframeDoc.find("body").append($fakeCursor);

    let i = 0;
    const startPlay = Date.now();

    (function draw() {
      let event = recording.events[i];
      if (!event) {
        return;
      }
      let offsetRecording = event.time - recording.startTime;
      let offsetPlay = (Date.now() - startPlay) * SPEED;
      if (offsetPlay >= offsetRecording) {
        drawEvent(event, $fakeCursor, $iframeDoc);
        i++;
      }

      if (i < recording.events.length) {
        requestAnimationFrame(draw);
      } else {
        $iframe.remove();
      }
    })();
  };
  useEffect(handleTyper, []);
  return (
    <main id="home">
      <div className={classes.homeContent}>
        <h1 className={classes.greeting}>Hi There !</h1>
        <h2>
          I'm &nbsp;
          <span id="name" style={{ color: uiColor }}>
            {PersonalData.firstName}&nbsp;{PersonalData.lastName}
          </span>
        </h2>
        <h3 style={{ color: nonThemeColor }}>{PersonalData.nickName}</h3>
        <div className={classes.autoText}>
          I am a &nbsp; <span id="typer" style={{ color: uiColor }}></span>
        </div>
        <p className={classes.connectText}>
          Feel free to <span style={{ color: uiColor }}>connect</span> with me.
        </p>
        <SocialLinks className={classes.links} />
      </div>
      <PlayButton
        id={"record"}
        text={"Record"}
        handleIsRecording={handleIsRecording}
      ></PlayButton>
      {/* <button id="record" onClick={handleIsRecording}>
        Record
      </button> */}
      <button id="play" onClick={handlePlay}>
        Play
      </button>
      <div className={classes.avatarImage}>
        <img src={profileAvatar} alt="" srcSet="" />
      </div>
    </main>
  );
}
export default Home;
