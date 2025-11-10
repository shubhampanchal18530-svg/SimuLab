import React from 'react';

/**
 * ChunkErrorBoundary
 * Catches dynamic import / chunk loading errors (ChunkLoadError) and shows
 * a small UI to reload the page or retry. This handles cases where the dev
 * server or HMR left the browser with stale chunk filenames (common during
 * rebuilds) and prevents the uncaught runtime error shown in the screenshot.
 */
class ChunkErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // you could log this to an analytics endpoint if desired
    // console.error('ChunkErrorBoundary caught', error, info);
  }

  retry = () => {
    // Simple strategy: refresh the page to reload the correct chunks.
    // We avoid programmatic re-import complexity for a robust user recovery.
    window.location.reload();
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const msg = (error && error.message) || String(error);
    const isChunkError = /loading chunk|ChunkLoadError/i.test(msg);

    return (
      <div style={{ maxWidth: 800, margin: '40px auto', textAlign: 'center', color: '#E2E8F0' }}>
        <h2>Problem loading the experiment</h2>
        <p style={{ color: '#94A3B8' }}>
          We had trouble loading the experiment resources. This can happen after a code rebuild or network issue.
        </p>
        <p style={{ color: '#FCA5A5', fontSize: 13 }}>{isChunkError ? 'ChunkLoadError: the app could not load a JavaScript chunk.' : msg}</p>
        <div style={{ marginTop: 16 }}>
          <button className="start-btn" onClick={this.retry}>Reload page</button>
        </div>
      </div>
    );
  }
}

export default ChunkErrorBoundary;
