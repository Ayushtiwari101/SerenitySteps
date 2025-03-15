import './Games.css';
import { Link } from 'react-router-dom';


function Games(){
    return(
        <>
            <nav>
                <div className='game-navbar'>
                <Link to="/home" className="back-button">← Back to Home</Link>
                <h1 className='sectionghead'>Mind Games</h1>                          
                </div> 
            </nav>
            <img src="./Bg_capstone.jpeg" alt="" id='home-bg'/>
            
            <div className='game-section'>
                <div className="gameblock" >
                    <div className='gamebox'>
                        <div className="img"><img src="/chess.webp" alt="" className='gamebox-logo' /></div>
                        <a href="https://www.chess.com/" className='game-btn'>Play Chess</a>
                    </div>
                </div>
                <div className="gameblock">
                    <div className='gamebox'><img src="/game2.jpeg" alt="" className='gamebox-logo'/>
                        <a href="https://skribbl.io/" className="game-btn">Play Skribbl</a>
                    </div>
                </div>
                <div className="gameblock">
                    <div className='gamebox'><img src="/" alt="" className='gamebox-logo'/>
                        <a href="" className="game-btn">Coming Soon</a>
                    </div>
                </div>
                <div className="gameblock">
                    <div className='gamebox'><img src="/" alt="" className='gamebox-logo'/>
                        <a href="" className="game-btn">Coming Soon</a>
                    </div>
                </div>
                
                
            </div>

        </>
    )

}
export default Games