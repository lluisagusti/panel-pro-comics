
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Comic, ComicPanel, TextBubble, Caption } from '@/types';

// Helper function to generate unique IDs without dependencies
const generateId = () => {
  const timestamp = new Date().getTime();
  const randomPart = Math.floor(Math.random() * 1000000);
  return `${timestamp}-${randomPart}`;
};

interface ComicContextType {
  comics: Comic[];
  currentComic: Comic | null;
  setCurrentComic: (comic: Comic) => void;
  createComic: (title: string, userId: string) => Comic;
  updateComic: (comic: Comic) => void;
  deleteComic: (comicId: string) => void;
  addPanel: (comicId: string, imageUrl: string, prompt?: string) => void;
  removePanel: (comicId: string, panelId: string) => void;
  updatePanel: (comicId: string, panel: ComicPanel) => void;
  addTextBubble: (comicId: string, panelId: string, text: string, style: 'speech' | 'thought') => void;
  updateTextBubble: (comicId: string, panelId: string, textBubble: TextBubble) => void;
  removeTextBubble: (comicId: string, panelId: string, textBubbleId: string) => void;
  addCaption: (comicId: string, panelId: string, text: string, position: 'top' | 'bottom') => void;
  updateCaption: (comicId: string, panelId: string, caption: Caption) => void;
  removeCaption: (comicId: string, panelId: string, captionId: string) => void;
  publishComic: (comicId: string) => void;
}

const ComicContext = createContext<ComicContextType | undefined>(undefined);

export const ComicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [comics, setComics] = useState<Comic[]>([]);
  const [currentComic, setCurrentComic] = useState<Comic | null>(null);

  // Load comics from local storage (would be DB in production)
  React.useEffect(() => {
    const storedComics = localStorage.getItem('comics');
    if (storedComics) {
      setComics(JSON.parse(storedComics));
    }
  }, []);

  // Save comics to local storage when they change
  React.useEffect(() => {
    if (comics.length > 0) {
      localStorage.setItem('comics', JSON.stringify(comics));
    }
  }, [comics]);

  const createComic = (title: string, userId: string): Comic => {
    const newComic: Comic = {
      id: generateId(),
      userId,
      title,
      panels: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublished: false
    };

    setComics(prevComics => [...prevComics, newComic]);
    setCurrentComic(newComic);
    return newComic;
  };

  const updateComic = (updatedComic: Comic) => {
    updatedComic.updatedAt = new Date().toISOString();
    
    setComics(prevComics => 
      prevComics.map(comic => 
        comic.id === updatedComic.id ? updatedComic : comic
      )
    );
    
    if (currentComic?.id === updatedComic.id) {
      setCurrentComic(updatedComic);
    }
  };

  const deleteComic = (comicId: string) => {
    setComics(prevComics => prevComics.filter(comic => comic.id !== comicId));
    
    if (currentComic?.id === comicId) {
      setCurrentComic(null);
    }
  };

  const addPanel = (comicId: string, imageUrl: string, prompt?: string) => {
    const newPanel: ComicPanel = {
      id: generateId(),
      imageUrl,
      textBubbles: [],
      captions: [],
      generationPrompt: prompt
    };

    setComics(prevComics => 
      prevComics.map(comic => {
        if (comic.id === comicId) {
          return {
            ...comic,
            panels: [...comic.panels, newPanel],
            updatedAt: new Date().toISOString()
          };
        }
        return comic;
      })
    );

    if (currentComic?.id === comicId) {
      setCurrentComic(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          panels: [...prev.panels, newPanel],
          updatedAt: new Date().toISOString()
        };
      });
    }
  };

  const removePanel = (comicId: string, panelId: string) => {
    setComics(prevComics => 
      prevComics.map(comic => {
        if (comic.id === comicId) {
          return {
            ...comic,
            panels: comic.panels.filter(panel => panel.id !== panelId),
            updatedAt: new Date().toISOString()
          };
        }
        return comic;
      })
    );

    if (currentComic?.id === comicId) {
      setCurrentComic(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          panels: prev.panels.filter(panel => panel.id !== panelId),
          updatedAt: new Date().toISOString()
        };
      });
    }
  };

  const updatePanel = (comicId: string, updatedPanel: ComicPanel) => {
    setComics(prevComics => 
      prevComics.map(comic => {
        if (comic.id === comicId) {
          return {
            ...comic,
            panels: comic.panels.map(panel => 
              panel.id === updatedPanel.id ? updatedPanel : panel
            ),
            updatedAt: new Date().toISOString()
          };
        }
        return comic;
      })
    );

    if (currentComic?.id === comicId) {
      setCurrentComic(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          panels: prev.panels.map(panel => 
            panel.id === updatedPanel.id ? updatedPanel : panel
          ),
          updatedAt: new Date().toISOString()
        };
      });
    }
  };

  const addTextBubble = (comicId: string, panelId: string, text: string, style: 'speech' | 'thought') => {
    const newTextBubble: TextBubble = {
      id: generateId(),
      text,
      position: { x: 50, y: 50 }, // Default position in the middle
      style
    };

    setComics(prevComics => 
      prevComics.map(comic => {
        if (comic.id === comicId) {
          return {
            ...comic,
            panels: comic.panels.map(panel => {
              if (panel.id === panelId) {
                return {
                  ...panel,
                  textBubbles: [...panel.textBubbles, newTextBubble]
                };
              }
              return panel;
            }),
            updatedAt: new Date().toISOString()
          };
        }
        return comic;
      })
    );

    if (currentComic?.id === comicId) {
      setCurrentComic(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          panels: prev.panels.map(panel => {
            if (panel.id === panelId) {
              return {
                ...panel,
                textBubbles: [...panel.textBubbles, newTextBubble]
              };
            }
            return panel;
          }),
          updatedAt: new Date().toISOString()
        };
      });
    }
  };

  const updateTextBubble = (comicId: string, panelId: string, updatedTextBubble: TextBubble) => {
    setComics(prevComics => 
      prevComics.map(comic => {
        if (comic.id === comicId) {
          return {
            ...comic,
            panels: comic.panels.map(panel => {
              if (panel.id === panelId) {
                return {
                  ...panel,
                  textBubbles: panel.textBubbles.map(bubble => 
                    bubble.id === updatedTextBubble.id ? updatedTextBubble : bubble
                  )
                };
              }
              return panel;
            }),
            updatedAt: new Date().toISOString()
          };
        }
        return comic;
      })
    );

    if (currentComic?.id === comicId) {
      setCurrentComic(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          panels: prev.panels.map(panel => {
            if (panel.id === panelId) {
              return {
                ...panel,
                textBubbles: panel.textBubbles.map(bubble => 
                  bubble.id === updatedTextBubble.id ? updatedTextBubble : bubble
                )
              };
            }
            return panel;
          }),
          updatedAt: new Date().toISOString()
        };
      });
    }
  };

  const removeTextBubble = (comicId: string, panelId: string, textBubbleId: string) => {
    setComics(prevComics => 
      prevComics.map(comic => {
        if (comic.id === comicId) {
          return {
            ...comic,
            panels: comic.panels.map(panel => {
              if (panel.id === panelId) {
                return {
                  ...panel,
                  textBubbles: panel.textBubbles.filter(bubble => bubble.id !== textBubbleId)
                };
              }
              return panel;
            }),
            updatedAt: new Date().toISOString()
          };
        }
        return comic;
      })
    );

    if (currentComic?.id === comicId) {
      setCurrentComic(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          panels: prev.panels.map(panel => {
            if (panel.id === panelId) {
              return {
                ...panel,
                textBubbles: panel.textBubbles.filter(bubble => bubble.id !== textBubbleId)
              };
            }
            return panel;
          }),
          updatedAt: new Date().toISOString()
        };
      });
    }
  };

  const addCaption = (comicId: string, panelId: string, text: string, position: 'top' | 'bottom') => {
    const newCaption: Caption = {
      id: generateId(),
      text,
      position
    };

    setComics(prevComics => 
      prevComics.map(comic => {
        if (comic.id === comicId) {
          return {
            ...comic,
            panels: comic.panels.map(panel => {
              if (panel.id === panelId) {
                return {
                  ...panel,
                  captions: [...panel.captions, newCaption]
                };
              }
              return panel;
            }),
            updatedAt: new Date().toISOString()
          };
        }
        return comic;
      })
    );

    if (currentComic?.id === comicId) {
      setCurrentComic(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          panels: prev.panels.map(panel => {
            if (panel.id === panelId) {
              return {
                ...panel,
                captions: [...panel.captions, newCaption]
              };
            }
            return panel;
          }),
          updatedAt: new Date().toISOString()
        };
      });
    }
  };

  const updateCaption = (comicId: string, panelId: string, updatedCaption: Caption) => {
    setComics(prevComics => 
      prevComics.map(comic => {
        if (comic.id === comicId) {
          return {
            ...comic,
            panels: comic.panels.map(panel => {
              if (panel.id === panelId) {
                return {
                  ...panel,
                  captions: panel.captions.map(caption => 
                    caption.id === updatedCaption.id ? updatedCaption : caption
                  )
                };
              }
              return panel;
            }),
            updatedAt: new Date().toISOString()
          };
        }
        return comic;
      })
    );

    if (currentComic?.id === comicId) {
      setCurrentComic(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          panels: prev.panels.map(panel => {
            if (panel.id === panelId) {
              return {
                ...panel,
                captions: panel.captions.map(caption => 
                  caption.id === updatedCaption.id ? updatedCaption : caption
                )
              };
            }
            return panel;
          }),
          updatedAt: new Date().toISOString()
        };
      });
    }
  };

  const removeCaption = (comicId: string, panelId: string, captionId: string) => {
    setComics(prevComics => 
      prevComics.map(comic => {
        if (comic.id === comicId) {
          return {
            ...comic,
            panels: comic.panels.map(panel => {
              if (panel.id === panelId) {
                return {
                  ...panel,
                  captions: panel.captions.filter(caption => caption.id !== captionId)
                };
              }
              return panel;
            }),
            updatedAt: new Date().toISOString()
          };
        }
        return comic;
      })
    );

    if (currentComic?.id === comicId) {
      setCurrentComic(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          panels: prev.panels.map(panel => {
            if (panel.id === panelId) {
              return {
                ...panel,
                captions: panel.captions.filter(caption => caption.id !== captionId)
              };
            }
            return panel;
          }),
          updatedAt: new Date().toISOString()
        };
      });
    }
  };

  const publishComic = (comicId: string) => {
    setComics(prevComics => 
      prevComics.map(comic => {
        if (comic.id === comicId) {
          return {
            ...comic,
            isPublished: true,
            updatedAt: new Date().toISOString()
          };
        }
        return comic;
      })
    );

    if (currentComic?.id === comicId) {
      setCurrentComic(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          isPublished: true,
          updatedAt: new Date().toISOString()
        };
      });
    }
  };

  return (
    <ComicContext.Provider value={{
      comics,
      currentComic,
      setCurrentComic,
      createComic,
      updateComic,
      deleteComic,
      addPanel,
      removePanel,
      updatePanel,
      addTextBubble,
      updateTextBubble,
      removeTextBubble,
      addCaption,
      updateCaption,
      removeCaption,
      publishComic
    }}>
      {children}
    </ComicContext.Provider>
  );
};

export const useComic = () => {
  const context = useContext(ComicContext);
  if (context === undefined) {
    throw new Error('useComic must be used within a ComicProvider');
  }
  return context;
};
