import './Games.css';
import { Link } from 'react-router-dom';


function Games(){
    return(
        <>
            <nav>
                <div className='navbar'>
                <Link to="/home" className='title'><h1>Serenity Steps</h1></Link>
                                        
                </div> 
            </nav>
            <img src="./Bg_capstone.jpeg" alt="" id='home-bg'/>
            <h1 className='sectionghead'>Mind Games</h1>
            <div className='sssection'>
                <div className="homeblock" >
                    <div className='homebox'>
                        <div className="img"><img src="/chess.webp" alt="" className='homebox-logo' /></div>
                        <a href="https://www.chess.com/" className='home-btn'>Play Chess</a>
                    </div>
                </div>
                <div className="homeblock">
                    <div className='homebox'><img src="/game2.jpeg" alt="" className='homebox-logo'/>
                        <a href="https://skribbl.io/" className="home-btn">Play Skribbl</a>
                    </div>
                </div>
                <div className="homeblock">
                    <div className='homebox'><img src="/" alt="" className='homebox-logo'/>
                        <a href="" className="home-btn">Coming Soon</a>
                    </div>
                </div>
                <div className="homeblock">
                    <div className='homebox'><img src="/" alt="" className='homebox-logo'/>
                        <a href="" className="home-btn">Coming Soon</a>
                    </div>
                </div>
                
                
            </div>

        </>
    )

}
export default Games