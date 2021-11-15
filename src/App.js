import './App.css';
import {useState, useEffect} from 'react';

function App() {
  const [candidates, setCandidates] = useState([]);
  const [sortlist, setSortlist] = useState(JSON.parse(localStorage.getItem('sortlist'))  || []);
  const [search, setSearch] = useState('');
  const [searchlist, setSearchlist] = useState([]);
  const [rejected, setRejected] = useState(JSON.parse(localStorage.getItem('rejected'))  || []);
  const [tab, setTab] = useState(window.location.pathname);

  useEffect(() => {
    fetch('https://s3-ap-southeast-1.amazonaws.com/he-public-data/users49b8675.json')
    .then(response => response.json())
    .then(data => {
      setCandidates(data)
      setSearchlist(data)
    })  
  }, []);

  const styles = {
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '50px',
      alignItems: 'center',
      justifyContent: 'center',
      width: '80%',
      height: '100%',
      margin: 'auto',
      fontFamily: 'Roboto',
    },
    outerContainer: {
      width: '100%',
      height: '100%',
      backgroundColor: '#f5f5f5',
    },
    card : {
      display: 'flex',
      flexDirection: 'column',
      width: '18rem',
      height: '18rem',
      maxWidth: '18rem',
      maxHeight: '18rem',
      border: '1px solid black',
      borderRadius: '5px',
    },
    cardImage: {
      width: '100%',
      flex: '1',
      overflow: 'hidden',
    },
    cardBody: {
      flex: '0.1',
    },
    navbar: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      height: '3.5em',
      backgroundColor: '#152536',
      marginBottom: '1em',
    },
    navbarItem: {
      textDecoration: 'none',
      color: '#fff',
      fontSize: '1.2em',
      backgroundColor: '#152536',
      '&:hover': {
        backgroundColor: '#fff',
        color: '#152536',
      },
    },
    navbarItemActive: {
      backgroundColor: '#fff',
      color: '#152536',
    },
    search: {
      width: '100%',
      height: '3em',
      border: '1px solid #152536',
      borderRadius: '5px',
      padding: '0.5em',
      margin: '0.5em',
      fontSize: '1.2em',
      fontWeight: 'bold',
      backgroundColor: '#fff',
      color: '#152536',
      '&:focus': {
        outline: 'none',
      },
    },
  }

  const sortlistCandidate = (candidate) => {
    // set sortlist and remove from rejected
    let temp = false
    temp = sortlist.some(item => item.id === candidate.id);
    !temp && localStorage.setItem('sortlist', JSON.stringify(sortlist.concat(candidate)));
    !temp && setSortlist(sortlist.concat(candidate));

    localStorage.setItem('rejected', JSON.stringify(rejected.filter(item => item.id !== candidate.id)));
    setRejected(rejected.filter(item => item !== candidate));
  }

  const rejectCandidate = (candidate) => {
    // set rejected and remove from sortlist
    let temp = false
    temp = rejected.some(item => item.id === candidate.id);
    !temp && localStorage.setItem('rejected', JSON.stringify(rejected.concat(candidate)));
    !temp && setRejected(rejected.concat(candidate));

    localStorage.setItem('sortlist', JSON.stringify(sortlist.filter(item => item.id !== candidate.id)));
    setSortlist(sortlist.filter(item => item !== candidate));
  }

  const searchCandidate = (candidate) => {
    if (candidate.name.toLowerCase().includes(search.toLowerCase())) {
      return true;
    }
  }

  function card(canditate, buttons) {
    console.log(buttons)
    return (
      <a href={`:${canditate.id}`} key={canditate.id}>
        <div className="card" style={styles.card} >
          <img src={canditate.Image} className="card-img-top" width="100%" alt="..." style={styles.cardImage}/>
          <div className="card-body" style={styles.cardBody}>
            <h5 className="card-title">{canditate.name}</h5>
            {buttons &&<button className="btn btn-primary" onClick={() => sortlistCandidate(canditate)}>sortlist</button>}
            {buttons && <button className="btn btn-danger" onClick={() => rejectCandidate(canditate)}>Reject</button>}
          </div>
        </div>
      </a>
    )
  }

  const createCard = (candidates, buttons=true) => {
    let cards = [];

    for(let i = 0; i < candidates.length; i++) {
       cards.push(card(candidates[i], buttons));
    }

    return cards;
  }

  useEffect(() => {
    // search in candidates
    setSearchlist(candidates.filter(searchCandidate));
  }, [search])

  return (
    <div className="App" style={styles.outerContainer}>
      <div className="navbar" style={styles.navbar}>
        <div className="search">
          <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
        </div>
        <a href="/rejected" style={styles.navbarItem}>Rejected</a>
        <a href="/sortlist" style={styles.navbarItem}>Sortlist</a>
      </div>
      <div className="container" style={styles.container}>
        {tab==="/" && createCard(searchlist, false)}
        {tab==="/sortlist" && createCard(sortlist, false)}
        {tab==="/rejected" && createCard(rejected, false)}
        {tab[1]===":" && createCard(candidates.filter(item => item.id == tab.slice(2)))}
      </div>
    </div>
  );
}

export default App;
