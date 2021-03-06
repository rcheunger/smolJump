document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    grid.style.display = "none"
    const startScreen = document.querySelector('.startScreen')
    const endScreen = document.querySelector('.endScreen')
    endScreen.style.display = "none"
    const smol = document.createElement('div')
    let smolLeftSpace = 50
    let startPoint = 150
    let smolBottomSpace = startPoint
    let isGameOver = true
    let platformCount = 5
    let platforms = []
    let upTimerId 
    let downTimerId
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerId
    let rightTimerId
    let score = 0
    let endText = "SCORE: "
    let nftScore = 0
    let nftScoreEndText = "                 NFT SCORE: "


    startScreen.onclick = myFunction;
    
    function myFunction() {
        startScreen.style.display = "none";
        grid.style.display = "block"
        isGameOver = false
        start ()
    }
   
    function createSmol() {
        grid.appendChild(smol)
        smol.classList.add('smol')
        smolLeftSpace = platforms[0].left
        smol.style.left = smolLeftSpace + 'px'
        smol.style.bottom = smolBottomSpace + 'px'
    }

    class Platform {
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom
            this.left = Math.random() * 400
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }

    class NFT {
        constructor(newNftBottom) {
            this.bottom = newNftBottom
            this.left = Math.random() * 400
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('nft')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }

    function createPlatforms() {
        for (let i =0; i < platformCount; i++) {
            let platGap = 600 / platformCount
            let newPlatBottom = 100 + i * platGap
            let newPlatform = new Platform(newPlatBottom)
            platforms.push(newPlatform)
            console.log(platforms)
        }
    }

    function movePlatforms() {
        if (smolBottomSpace > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'

                if (platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    score++
                    console.log(platforms)
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                }
            })
        }
    }

    let nfts = [new NFT(500)]
    function moveNFTs() {
        if (smolBottomSpace > 200) {
            nfts.forEach(nft => {
                nft.bottom -= 4
                let visual = nft.visual
                visual.style.bottom = nft.bottom + 'px'

                if (nft.bottom < 10) {
                    let firstNft = nfts[0].visual
                    firstNft.classList.remove('nft')
                    nfts.shift()

                    let newNft = new NFT(500)
                    nfts.push(newNft)
                }
            })
        }
    }

    function jump() {
        clearInterval(downTimerId)
        isJumping = true
        upTimerId = setInterval(function () {
            checkIfCollectNft()
            smolBottomSpace += 20
            smol.style.bottom = smolBottomSpace + 'px'
            if (smolBottomSpace > startPoint + 200) {
                fall()
            }
        },30)
    }

    function fall() {
        clearInterval(upTimerId)
        isJumping = false
        downTimerId = setInterval(function () {
            smolBottomSpace -= 5
            smol.style.bottom = smolBottomSpace + 'px'
            if (smolBottomSpace <= 0) {
                gameOver()
            }
            checkIfCollectNft()
            platforms.forEach(platform => {
                if (
                    (smolBottomSpace >= platform.bottom) &&
                    (smolBottomSpace <= platform.bottom + 15) &&
                    ((smolLeftSpace + 60) >= platform.left) &&
                    (smolLeftSpace <= (platform.left + 85)) &&
                    !isJumping
                ) {
                    console.log('Landed')
                    startPoint = smolBottomSpace
                    jump()
                }
            })
        },30)
    }

    function checkIfCollectNft() {
        let nft = nfts[0]
        if(
            smolBottomSpace >= nft.bottom &&
            smolBottomSpace <= nft.bottom + 50 &&
            ((smolLeftSpace + 50) >= nft.left) &&
            smolLeftSpace <= nft.left + 50
        ) {
            console.log('collision')
            nftScore++
            let firstNft = nfts[0].visual
            firstNft.classList.remove('nft')
            nfts.shift()

            let newNft= new NFT(500)
            nfts.push(newNft)
        }
    }

    function gameOver() {
        console.log('Game Over')
        isGameOver = true
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
        startScreen.style.display = "none"
        grid.style.display = "none"
        endScreen.style.display = "block"
        
        restart()
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }

        endScreen.innerHTML = endText + score + nftScoreEndText + nftScore
        endScreen.style.color = "white"
        endScreen.style.fontSize = "100px"
        loadImagesOfMintedNfts()
        grid.classList.remove("hide")

        function restart () {
            addEventListener("click", restart);
            function restart() {
                window.location.reload();
        }
    }}

    function control(e) {
        if (e.key === "ArrowLeft") {
            moveLeft()
        } else if (e.key === "ArrowRight") {
            moveRight()
        } else if (e.key === "ArrowUp") {
            moveStraight()
        }

    }

    function moveLeft() {
        clearInterval(leftTimerId)
        if (isGoingRight) {
            clearInterval(rightTimerId)
            isGoingRight = false
        }
        isGoingLeft = true
        leftTimerId = setInterval(function () {
            if (smolLeftSpace >= 0) {
                smolLeftSpace -= 5
                 smol.style.left = smolLeftSpace + 'px'
            } else moveRight()
        },30)
    }

    function moveRight() {
        clearInterval(rightTimerId)
        if (isGoingLeft) {
            clearInterval (leftTimerId)
            isGoingLeft = false
        }
        isGoingRight = true 
        rightTimerId = setInterval(function () {
            if (smolLeftSpace <= 440) {
                smolLeftSpace += 5
                smol.style.left = smolLeftSpace + 'px'
            } else moveLeft
        },30)
    }

    function moveStraight () {
        isGoingRight = false
        isGoingLeft = false
        clearInterval(rightTimerId)
        clearInterval(leftTimerId)
    }

    function start() {
        if (!isGameOver){
            grid.style.display = "block";
            createPlatforms()
            createSmol()
            setInterval(movePlatforms,30)
            setInterval(moveNFTs, 30)
            jump()
            document.addEventListener('keyup',control)
        }
    }

    start()

    function loadImagesOfMintedNfts() {
        for(let i = 1; i<= 10; i++) {
            if(localStorage.getItem(i.toString())) {
                console.log(`element with id ${i} is minted`)
                const nft1 = document.getElementById(i)
                const att = document.createAttribute("style")
                att.value = `content:url(./nfts/${i}.png)`
                nft1.setAttributeNode(att);
            }
        }
    }

})