//------------------------------ MODULE -------------------------------------
import styled, { keyframes } from "styled-components";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SimpleMotion } from "component";
import { apiCall } from "lib";
import pipeImg from "data/img/game/flappybird-pipe.png";
import birdImg from "data/img/game/flappy-bird.png";
import skyImg from "data/img/game/fb-game-background.png";
import groundImg from "data/img/game/bottom-background.png";
import startButton from "data/img/game/start-button.png";
import gameOverIcon from "data/img/game/gameover.png";
import rocketsPattern from "data/img/game/rockets-pattern.jpg";

//------------------------------ CSS ----------------------------------------
const StyledFixedBackground = styled.div`
    position:fixed;
    height:100%;
    width:100%;
    background:url(${rocketsPattern}) repeat;
    background-size:80%;
`;
const StyledFlappyBird = styled.div`
    height:600px;
    width:330px;
    position:relative;
    margin:auto;
    border-radius:1em;
    overflow:hidden;
    top:3%;
`;
const StyledGameContainer = styled.div`
    overflow:hidden;
    width:100%;
    height:100%;
    position:absolute;
`;
const slide = keyframes`
    100% {
        background-position: 500% 0;
    }
`;
const StyledSky = styled.div`
    background:url(${skyImg}) repeat-x;
    background-size: 125%;
    animation: ${slide} 5.5s linear infinite;
    width:100%;
    height:81%;
    position:absolute;
`;
const StyledGround = styled.div`
    background:url(${groundImg}) repeat-x;
    animation: ${slide} 5s linear infinite;
    width:100%;
    height:20%;
    position:absolute;
    top:79%;
    z-index:1;
`;
const StyledBird = styled.img`
    position:absolute;
    width:3em;
    height:3em;
    z-index:1;
`;
const StyledStart = styled.img`
    height:3em;
    width:7.2em;
    position:absolute;
    z-index: 1;
    top: 30%;
    left: 35%;
`;
const StyledGameOver = styled.img`
    display:none;
    height:3em;
    width:7.2em;
    position:absolute;
    z-index: 1;
    top: 30%;
    left: 35%;
`;
const StyledScore = styled.div`
    position: absolute;
    z-index: 1;
    right:8%;
    top:3%;
    font-weight: bold;
    & span:first-child {
        font-size:2.2em;
        color:crimson;
    };
    & span:last-child {
        font-size:1em;
        color:#444;
    };    
`;

//------------------------------ COMPONENT ----------------------------------
const FlappyBird = () => {
    //init
    const navigate = useNavigate();
    const bird = useRef();
    const gameDisplay = useRef();
    const sky = useRef();
    const ground = useRef();
    const endRef = useRef();
    const scoreRef = useRef();
    let birdLeft;
    let birdBottom;
    let gravity;
    let gravityFrame;
    let isRunning = true;
    let jumpGuage = 0;
    let jumpFrame;
    let scoreInterval;

    //state
    const [gameState, setGameState] = useState('ready');

    //function
    const startGame = () => { 
        if(birdBottom > 0) birdBottom -= gravity;
        bird.current.style.left = `${birdLeft}em`;
        bird.current.style.bottom = `${birdBottom}em`;
        gravityFrame = window.requestAnimationFrame(startGame);
    }

    const jump = () => {
        if(birdBottom >= 30) return;
        birdBottom += 0.7;
        jumpGuage += 0.7;
        bird.current.style.bottom = `${birdBottom}em`;
        jumpFrame = window.requestAnimationFrame(jump);
        if(jumpGuage >= 5){
            window.cancelAnimationFrame(jumpFrame);
            jumpGuage = 0;
        } 
    }

    const gameOver = (mf) => {
        //setGameState('end');
        window.cancelAnimationFrame(mf);
        window.cancelAnimationFrame(gravityFrame);
        isRunning = false;
        document.removeEventListener('click', jump);
        sky.current.style.animationPlayState = 'paused';
        ground.current.style.animationPlayState = 'paused';        
        endRef.current.style.display="inline-block";
        clearInterval(scoreInterval);
        
        const params = { 'amount' : Number(scoreRef.current.innerHTML) };
        apiCall.get("/member/any/point", {params});
    }

    const generateBottomObs = () => {
        if(!isRunning) return;
        let moveFrame;

        let obstacleLeft;
        let obstacleBottom;
        
        let randomHeight = Math.random() * 8;
        let randomWidth = Math.random() * 5;
        let randomDelay = (Math.random()*(3000-500)) + 500;

        obstacleLeft = "40";
        obstacleBottom = randomHeight;
        const obstacle = document.createElement('img');
        obstacle.setAttribute('src', pipeImg);
        obstacle.style.width = `3em`;
        obstacle.style.height = `15em`;
        obstacle.style.position = 'absolute';

        gameDisplay.current.appendChild(obstacle);
        obstacle.style.left = `${obstacleLeft}em`;
        obstacle.style.bottom = `${obstacleBottom}em`;

        const moveObstacle = () => {
            if(!isRunning) return;
            obstacleLeft -= 0.2;
            obstacle.style.left = `${obstacleLeft}em`;
            
            moveFrame = window.requestAnimationFrame(moveObstacle);
            
            if(birdBottom <= 0 || (birdBottom <= (randomHeight+7.3) && obstacleLeft >= -1 && obstacleLeft <= 5)){
                gameOver(moveFrame);
            }

            if(obstacleLeft < -randomWidth*4-5){
                if(gameDisplay.current.contains(obstacle)) gameDisplay.current.removeChild(obstacle);
            }                         
        }
        moveObstacle();

        setTimeout(generateBottomObs, randomDelay);       
    }

    const generateTopObs = () => {
        if(!isRunning) return;
        let moveFrame;

        let obstacleLeft;
        let obstacleBottom;
        
        let randomHeight = Math.random() * 5;
        let randomWidth = Math.random() * 5;
        let randomDelay = (Math.random()*(3000-500)) + 500;

        obstacleLeft = "40";
        obstacleBottom = randomHeight;
        const obstacle = document.createElement('img');
        obstacle.setAttribute('src', pipeImg);
        obstacle.style.width = `3em`;
        obstacle.style.height = `15em`;
        obstacle.style.position = 'absolute';
        obstacle.style.transform = 'rotate(180deg)';

        gameDisplay.current.appendChild(obstacle);
        obstacle.style.left = `${obstacleLeft}em`;
        obstacle.style.bottom = `${obstacleBottom+30}em`;

        const moveObstacle = () => {
            if(!isRunning) return;
            obstacleLeft -= 0.2;
            obstacle.style.left = `${obstacleLeft}em`;
            
            moveFrame = window.requestAnimationFrame(moveObstacle);
            
            if(birdBottom <= 0 || (birdBottom >= (randomHeight+19) && obstacleLeft >= -1 && obstacleLeft <= 5)){
                gameOver(moveFrame)
            }

            if(obstacleLeft < -randomWidth*4-5){
                if(gameDisplay.current.contains(obstacle)) gameDisplay.current.removeChild(obstacle);
            }                         
        }
        moveObstacle();

        setTimeout(generateTopObs, randomDelay);       
    }

    //effect
    useEffect(() => {
        //init
        birdLeft = 2;
        birdBottom = 8;
        gravity = 0.2;

        //control
        if(gameState == 'ready'){
            bird.current.style.left = `${birdLeft}em`;
            bird.current.style.bottom = `${birdBottom}em`;
            sky.current.style.animationPlayState = 'paused';
            ground.current.style.animationPlayState = 'paused';                      
        }else if(gameState == 'start'){
            sky.current.style.animationPlayState = 'running';
            ground.current.style.animationPlayState = 'running';                      
            startGame();
            generateBottomObs();
            generateTopObs();
            document.addEventListener('click', jump);
            scoreInterval = setInterval(() => {
                scoreRef.current.innerHTML = Number(scoreRef.current.innerHTML) + 1
            }, 1000);
        }
    }, [gameState]);

    //memo
    const mainGear = useMemo(() => {
        return(
            <StyledFlappyBird>
                <StyledGameContainer ref={gameDisplay}>
                    <StyledScore>
                        <span ref={scoreRef}>0 </span>
                        <span> 원 적립!</span>
                    </StyledScore>
                    <StyledSky ref={sky}>
                        <StyledBird src={birdImg} ref={bird} />
                    </StyledSky>
                    <StyledGround ref={ground}></StyledGround>
                </StyledGameContainer>
            </StyledFlappyBird>            
        )
    }, []);

    const buttonGear = useMemo(() => {
        return(
            <>
                {gameState == 'ready' ? <StyledStart src={startButton} onClick={() => setGameState('start')}/> : null}
                <StyledGameOver ref={endRef} src={gameOverIcon} onClick={() => navigate('/', {replace:true})}/>
            </>
        )
    }, [gameState])

    //render
    return (
        <SimpleMotion>
            <StyledFixedBackground />
            {mainGear}
            {buttonGear}
        </SimpleMotion>
    )
}

export default FlappyBird;