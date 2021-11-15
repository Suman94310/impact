import './App.css';
import {useState, useEffect, useCallback} from 'react';

function App() {
  const [candidates, setCandidates] = useState([]);
  const [sortlist, setSortlist] = useState(JSON.parse(localStorage.getItem('sortlist'))  || []);
  const [search, setSearch] = useState('');
  const [searchlist, setSearchlist] = useState([]);
  const [rejected, setRejected] = useState(JSON.parse(localStorage.getItem('rejected'))  || []);
  const [tab, ] = useState(window.location.pathname);

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
      minWidth: `${tab[1]===":"?'12rem':'12rem'}`,
      minHeight: `${tab[1]===":"?'17rem':'14rem'}`,
      maxWidth: `${tab[1]===":"?'22rem':'12rem'}`,
      maxHeight: `${tab[1]===":"?'27rem':'14rem'}`,
      backgroundColor: '#fff',
      borderRadius: '7px',
      overflow: 'hidden',
      boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.2)',
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
      // width: '100%',
      height: '3.5em',
      backgroundColor: '#252c35',
      marginBottom: '2em',
      padding: '0 5vw',
    },
    navbarItem: {
      textDecoration: 'none',
      color: '#fff',
      fontSize: '1.1em',
      marginLeft: '2em',
      fontWeight: '300',
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
      padding: '0.2em',
      fontSize: '1em',
      backgroundColor: '#fff',
      border: '1px solid #152536',
      color: '#152536',
      '&:focus': {
        outline: 'none',
      },
    },
    sort: {
      padding: '1em',
      fontSize: '1em',
      backgroundColor: '#239e2f',
      width: "50%",
      border: 'none',
      color: '#fff'
    },
    reject: {
      padding: '1em',
      fontSize: '1em',
      backgroundColor: '#bd0924',
      width: "50%",
      border: 'none',
      color: '#fff'
    }
  }

  const sortlistCandidate = (candidate) => {
    // set sortlist and remove from rejected
    let temp = false
    temp = sortlist.some(item => item.id === candidate.id);
    !temp && localStorage.setItem('sortlist', JSON.stringify(sortlist.concat(candidate)));
    !temp && setSortlist(sortlist.concat(candidate));

    localStorage.setItem('rejected', JSON.stringify(rejected.filter(item => item.id !== candidate.id)));
    setRejected(rejected.filter(item => item !== candidate));
    // redirect to home
    window.location = window.location.protocol + '//' + window.location.host+ '/';
  }

  const rejectCandidate = (candidate) => {
    // set rejected and remove from sortlist
    let temp = false
    temp = rejected.some(item => item.id === candidate.id);
    !temp && localStorage.setItem('rejected', JSON.stringify(rejected.concat(candidate)));
    !temp && setRejected(rejected.concat(candidate));

    localStorage.setItem('sortlist', JSON.stringify(sortlist.filter(item => item.id !== candidate.id)));
    setSortlist(sortlist.filter(item => item !== candidate));
    // redirect to home
    window.location = window.location.protocol + '//' + window.location.host+ '/';
  }

  const searchCandidate = useCallback((candidate) => {
    if (candidate.name.toLowerCase().includes(search.toLowerCase())) {
      return true;
    }
  },[search]);

  function card(canditate, buttons) {
    console.log(buttons)
    return (
      <a href={`:${canditate.id}`} key={canditate.id}>
        <div className="card" style={styles.card} >
          <img src={canditate.Image} className="card-img-top" width="100%" alt="..." style={styles.cardImage}/>
          <div className="card-body" style={styles.cardBody}>
            <h5 className="card-title">{canditate.name}</h5>
            {buttons &&<button className="btn btn-primary" onClick={(e) => {e.preventDefault();sortlistCandidate(canditate)}} style={styles.sort}>Sortlist</button>}
            {buttons && <button className="btn btn-danger" onClick={(e) => {e.preventDefault();rejectCandidate(canditate)}} style={styles.reject}>Reject</button>}
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
  }, [search, searchCandidate, candidates]);

  return (
    <div className="App" style={styles.outerContainer}>
      <style>
        {`
          .App {
            background-color: #f5f5f5;
          }
          body {
            background-color: #f5f5f5;
            height: 100%;
          }
          a {
            text-decoration: none;
            font-color: inherit;
          }
          .card {
            font-size: 1em;
            color: #616161;
          }
          button:hover {
            cursor: pointer;
          }
        `}
      </style>
      <div className="navbar" style={styles.navbar}>
        <a href="/" style={styles.navbarItem}>Home</a>
        <div className="search">
          <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} style={styles.search}/>
        </div>
        <div>
          <a href="/rejected" style={styles.navbarItem}>Rejected</a>
          <a href="/sortlisted" style={styles.navbarItem}>Sortlist</a>
        </div>
      </div>
      <div className="container" style={styles.container}>
        {tab==="/" && createCard(searchlist, false)}
        {tab==="/sortlisted" && createCard(sortlist, false)}
        {tab==="/rejected" && createCard(rejected, false)}
        {tab[1]===":" && createCard(candidates.filter(item => item.id.toString() === tab.slice(2)))}
      </div>
    </div>
  );
}

export default App;
