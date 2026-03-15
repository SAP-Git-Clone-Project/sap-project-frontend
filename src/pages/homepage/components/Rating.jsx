import React from 'react'
import { useState } from 'react';

const Rating = () => {

  const [rating, setRating] = useState(4);

  return (
    <div className="card bg-base-200 p-6">
      <h2 className="text-xs font-semibold tracking-widest uppercase text-base-content/50 mb-4">Rating</h2>
      <div className="rating rating-lg">
        {[1, 2, 3, 4, 5].map((v) => (
          <input key={v} type="radio" name="rating" className="mask mask-star-2 bg-accent" checked={rating === v} onChange={() => setRating(v)} />
        ))}
      </div>
      <p className="text-xs text-base-content/50 mt-2">{rating}/5 — Code quality score</p>
    </div>
  )
}

export default Rating