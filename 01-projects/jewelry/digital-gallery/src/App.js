import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- YOUR DIGITAL SIGNATURES ---
// Replace the text inside the quotes with your actual Supabase URL and Key
const supabaseUrl = 'https://wzikhtfkfvulyukvmknt.supabase.co/auth/v1/.well-known/jwks.json';
const supabaseKey = 'sb_publishable_KQ-xq4UA-8KzZ1_HGmAoeA_Cbux7R2I';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [bid, setBid] = useState(0); // Starts at 0, will update from database
  const [timeLeft, setTimeLeft] = useState(3600);

  // Fetch the current bid from your ledger as soon as the gallery opens
  useEffect(() => {
    const fetchAuctionData = async () => {
      const { data, error } = await supabase
        .from('auction_item')
        .select('current_bid')
        .limit(1)
        .single();

      if (data) {
        setBid(data.current_bid);
      }
      if (error) {
        console.error("Error reading ledger:", error);
      }
    };

    fetchAuctionData();
  }, []);

  // When a collector clicks PLACE BID, it updates the master ledger
  const handleBid = async () => {
    const newBid = bid + 15;
    setBid(newBid); // Updates the screen instantly

    // Sends the new price to Supabase
    const { error } = await supabase
      .from('auction_item')
      .update({ current_bid: newBid })
      .neq('current_bid', 0); // Safety check to update the row
      
    if (error) {
      console.error("Error updating ledger:", error);
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
      
      {/* Gallery Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '2rem', borderBottom: '1px solid #333' }}>
        <div style={{ fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase' }}>TBD Gallery</div>
        <nav style={{ display: 'flex', gap: '2.5rem', fontSize: '0.85rem', letterSpacing: '1px' }}>
          <span style={{ cursor: 'pointer' }}>Exhibitions</span>
          <span style={{ cursor: 'pointer' }}>Aura Curation</span>
          <span style={{ cursor: 'pointer' }}>Provenance</span>
        </nav>
      </header>

      {/* Main Exhibition Content */}
      <main style={{ display: 'flex', height: 'calc(100vh - 100px)', flexWrap: 'wrap' }}>
        
        {/* Left Side: The Shadowbox Image */}
        <div style={{ flex: '1 1 50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', borderRight: '1px solid #333' }}>
          <div style={{ width: '100%', height: '100%', backgroundColor: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #222' }}>
            <span style={{ color: '#444', fontStyle: 'italic', fontFamily: 'serif', letterSpacing: '1px' }}>
              [ Hyper-real grayscale image of artisan silver ring suspended in darkness ]
            </span>
          </div>
        </div>

        {/* Right Side: Museum Placard & Auction Block */}
        <div style={{ flex: '1 1 50%', padding: '5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          
          <h1 style={{ fontSize: '3.5rem', margin: '0 0 0.5rem 0', fontWeight: '300', letterSpacing: '-1px' }}>
            The Indigo Transition
          </h1>
          
          <div style={{ fontFamily: 'monospace', color: '#777', marginBottom: '3rem', letterSpacing: '1.5px', fontSize: '0.9rem' }}>
            AURA TAG: COSMIC INDIGO // EDITION: 1 OF 1
          </div>
          
          <p style={{ fontFamily: 'serif', fontSize: '1.15rem', lineHeight: '1.8', color: '#ccc', marginBottom: '4rem', maxWidth: '90%' }}>
            Forged in the quiet hours of midnight, this raw silver piece holds the weight of transition. 
            Deliberately imperfect, its hammered textures capture the restless energy of moving from what was 
            to what will be. It is not merely worn; it is carried as a modern talisman for profound intuition and truth.
          </p>

          {/* Vintage Digital Auction Block */}
          <div style={{ border: '1px solid #fff', padding: '2rem', fontFamily: 'monospace', maxWidth: '450px', backgroundColor: '#050505' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#888', fontSize: '0.85rem' }}>
              <span>CURRENT VALUATION</span>
              <span>TIME REMAINING</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', fontSize: '1.75rem', color: '#fff' }}>
              <span>${bid} USD</span>
              <span style={{ color: timeLeft < 300 ? '#ff3333' : '#fff' }}>
                {formatTime(timeLeft)}
              </span>
            </div>
            
            <button 
              onClick={handleBid}
              style={{ 
                width: '100%', 
                padding: '1.25rem', 
                backgroundColor: '#fff', 
                color: '#000', 
                border: 'none', 
                fontFamily: 'monospace', 
                fontSize: '1.1rem', 
                cursor: 'pointer', 
                fontWeight: 'bold',
                letterSpacing: '1px',
                transition: 'background-color 0.2s ease'
              }}>
              PLACE BID (+$15)
            </button>
            <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.7rem', color: '#555' }}>
              SECURE GALLERY AUCTION PROTOCOL
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}