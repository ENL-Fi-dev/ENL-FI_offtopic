import React, {} from 'react';

import Footer from './components/footer';
import Groups from './components/groups';
import Header from './components/header';

const App = (props) => {
  return <article>
    <Header/>
    <Groups/>
    <Footer/>
  </article>;
};

export default App;