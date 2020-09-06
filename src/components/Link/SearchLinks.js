import React, { useState, useEffect, useContext } from "react";
import { FirebaseContext } from "../../firebase";
import LinkItem from "./LinkItem";

function SearchLinks() {
  const { firebase } = useContext(FirebaseContext);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [filter, setFilter] = useState("");
  const [links, setLinks] = useState([]);

  useEffect(() => {
    getInitialLinks();
  });

  function getInitialLinks() {
    firebase.db.collection("links").get().then((snapshot) => {
      const links = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setLinks(links);
    });
  }

  function handleSearch(e) {
    e.preventDefault();
    const query = filter.toLowerCase();
    const mathedLinks = links.filter((link) => {
      return (
        link.description.toLowerCase().includes(query) ||
        link.url.toLowerCase().includes(query) ||
        link.postedBy.name.toLowerCase().includes(query)
      );
    });
    setFilteredLinks(mathedLinks);
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <div>
          Search <input onChange={(e) => setFilter(e.target.value)} />
          <button>OK</button>
        </div>
      </form>

      {filteredLinks.map((filteredLink, index) => (
        <LinkItem
          key={filteredLink.id}
          showCount={false}
          link={filteredLink}
          index={index}
        />
      ))}
    </div>
  );
}

export default SearchLinks;
