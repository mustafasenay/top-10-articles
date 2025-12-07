import { useState,useEffect } from "react";
import axios from "axios";

function ArticleList() {

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getTopStories() {
      try {
        setLoading(true);
        const { data: storyIds } = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json'); // önce topstorylerin idsi
        
        const top10Promises = storyIds.slice(0, 10).map(id =>
          axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`) // sonra id ile eşleşenleri al
        );
        const responses = await Promise.all(top10Promises);

        const storiesData = responses.map(response => ({
          id: response.data.id,
          title: response.data.title,
          url: response.data.url || `https://news.ycombinator.com/item?id=${response.data.id}`,
          score: response.data.score,
          by: response.data.by,
          descendants: response.data.descendants || 0
        }));
        
        setStories(storiesData); // storiesDatayı setle
        setLoading(false);
        
      } catch (error) {
        console.error('Error:', error);
        setError('veri çekilirken bir hata oluştu.');
        setLoading(false);
      }
    }
    getTopStories();
  }, []);

  if(loading) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <p>Loading ...</p>
          </div>
        </div>
      </div>
    );
  }

  if(error) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12 text-center text-danger">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="mb-2">Hacker News Top 10 Articles</h1>
              {stories.map((story) => (
                <div className="d-flex justify-content-between align-items-start">
                  <div className="card" style={{padding: "15px", marginBottom: "1rem"}}>
                    <h3 style={{margin: '0px'}}>
                      {story.title}
                      <a href={story.url} style={{marginLeft: "1rem"}}>
                        link
                      </a>
                    </h3>
                    <small className="text-muted">
                      {story.score} by {story.by}
                    </small>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default ArticleList;