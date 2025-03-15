import './Home.css';
import { Link } from 'react-router-dom';


function Home(){
    return(
        <>
            <nav>
                <div className='home-navbar'>
                    <h1 className='Stitle'>Serenity Steps</h1>                    
                </div> 
            </nav>
            <img src="./Bg_capstone.jpeg" alt="" id='home-bg'/>
            <div className="continueprev">
                <div className="prevsection">
                    <h2>Serenity Steps is an integrated wellness platform that fosters the well-being by connecting meditation, mental health, physical fitness, and diet planning.It will provide the users with individualised advice and resources to help them maintain a healthy, balanced lifestyle.</h2>
                </div>      
            </div>
            <div className='sssection'>
                <div className="homeblock" >
                    <div className='homebox'>
                        <div className="img"><img src="/image.png" alt="" className='homebox-logo' /></div>
                        <h2 className='home-head'>Meditation Session</h2>
                        <a href="/meditate" className='home-btn'>Start Session</a>
                    </div>
                </div>
                <div className="homeblock">
                    <div className='homebox'><img src="/mind.png" alt="" className='homebox-logo' /><h2 className='home-head'>Mind Games</h2><a href="/games" className="home-btn">Play Games</a></div>
                </div>
                <div className="homeblock">
                    <div className='homebox'><img src="/fit.png" alt="" className='homebox-logo'/>
                    <h2 className='home-head'>Workout Session</h2>
                        <a href="/workout" className="home-btn">Start Workout</a>
                    </div>
                </div>
                <div className="homeblock">
                    <div className='homebox'><img src="/diet.png" alt="" className='homebox-logo' /><h2 className='home-head'>Diet Plan</h2><a href="/diet" className="home-btn">Get Diet</a></div>
                </div>
                
            </div>
            <footer>
                <div>

                </div>
            </footer>
        </>
    )
}
export default Home