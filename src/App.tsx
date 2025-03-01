import { useState, useEffect, useRef, KeyboardEvent, ChangeEvent } from "react";
import "./index.css";

// Text color constants
const COLORS = {
  DEFAULT: "text-green-300",
  PROMPT: "text-emerald-300",
  ERROR: "text-red-300",
  SUCCESS: "text-lime-300",
  WARNING: "text-yellow-300",
  INFO: "text-green-300", // Even brighter green for ASCII art and info messages
  HEADER: "text-emerald-300", // Distinctive emerald for headers
  FILE: "text-cyan-300",
  DIRECTORY: "text-blue-300",
};

// ANSI Shadow ASCII Art - Full version for larger screens
const ASCII_ART = [
  "+---------------------------------------------------------------------------------------------+",
  "|                                                                                             |",
  "|    ███████╗██╗███╗   ██╗ ██████╗ ██╗   ██╗██╗      █████╗ ██████╗ ██╗████████╗██╗   ██╗     |",
  "|    ██╔════╝██║████╗  ██║██╔════╝ ██║   ██║██║     ██╔══██╗██╔══██╗██║╚══██╔══╝╚██╗ ██╔╝     |",
  "|    ███████╗██║██╔██╗ ██║██║  ███╗██║   ██║██║     ███████║██████╔╝██║   ██║    ╚████╔╝      |",
  "|    ╚════██║██║██║╚██╗██║██║   ██║██║   ██║██║     ██╔══██║██╔══██╗██║   ██║     ╚██╔╝       |",
  "|    ███████║██║██║ ╚████║╚██████╔╝╚██████╔╝███████╗██║  ██║██║  ██║██║   ██║      ██║        |",
  "|    ╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝   ╚═╝      ╚═╝        |",
  "|                                                                                             |",
  "|                              ██╗      █████╗ ██████╗ ███████╗                               |",
  "|                              ██║     ██╔══██╗██╔══██╗██╔════╝                               |",
  "|                              ██║     ███████║██████╔╝███████╗                               |",
  "|                              ██║     ██╔══██║██╔══██╗╚════██║                               |",
  "|                              ███████╗██║  ██║██████╔╝███████║                               |",
  "|                              ╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝                               |",
  "|                                                                                             |",
  "|                              BUILDING NETWORK OF AI AGENTS                                  |",
  "|                                                                                             |",
  "|                                   VERSION 0.0.7 beta                                        |",
  "+---------------------------------------------------------------------------------------------+",
];

// Simplified ASCII Art for mobile screens
const MOBILE_ASCII_ART = [
  "+----------------------------+",
  "|                            |",
  "|     SINGULARITY            |",
  "|         LABS               |",
  "|                            |",
  "|  NETWORK OF AI AGENTS      |",
  "|                            |",
  "|     VERSION 0.0.7 beta     |",
  "+----------------------------+",
];

// Line with custom styling
const Line = ({
  text,
  color = COLORS.DEFAULT,
  className = "",
  animation = "",
}: {
  text: string;
  color?: string;
  className?: string;
  animation?: string;
}) => (
  <div className={`${color} ${className} ${animation} text-xs whitespace-pre font-mono`}>
    {text}
  </div>
);

interface HistoryItem {
  text: string;
  color?: string;
  className?: string;
  animation?: string;
}

const Terminal = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Initial welcome message with ASCII art
    const initialHistory: HistoryItem[] = [
      // Choose ASCII art based on screen size
      ...(isMobile ? 
        // Mobile ASCII art with glow effect
        MOBILE_ASCII_ART.map((line) => ({
          text: line,
          color: COLORS.INFO,
          animation: "ascii-glow",
        }))
        : 
        // Desktop ASCII art with all effects
        [
          // Border top and padding with glow effect
          { text: ASCII_ART[0], color: COLORS.INFO, animation: "ascii-glow" },
          { text: ASCII_ART[1], color: COLORS.INFO, animation: "ascii-glow" },
          { text: ASCII_ART[2], color: COLORS.INFO, animation: "ascii-glow" },
          
          // "Singularity" ASCII art with flicker effect
          ...ASCII_ART.slice(3, 9).map((line) => ({
            text: line,
            color: COLORS.INFO,
            animation: "ascii-glow ascii-flicker",
          })),
          
          // Spacer
          { text: ASCII_ART[9], color: COLORS.INFO, animation: "ascii-glow" },
          
          // "Labs" ASCII art with just glow animation
          ...ASCII_ART.slice(10, 16).map((line) => ({
            text: line,
            color: COLORS.INFO,
            animation: "ascii-glow",
          })),
          
          // Footer lines with glow effect
          ...ASCII_ART.slice(16).map((line) => ({
            text: line,
            color: COLORS.INFO,
            animation: "ascii-glow",
          })),
        ]
      ),
      
      { text: "", color: COLORS.DEFAULT },
      {
        text: "Welcome to Singularity Labs Terminal v0.0.7 beta",
        color: COLORS.HEADER,
        animation: "type-effect",
      },
      { 
        text: 'Type "help" to see available commands', 
        color: COLORS.INFO
      },
      // Add mobile experience notice only for mobile users
      ...(isMobile ? [
        { text: "", color: COLORS.DEFAULT },
        { 
          text: "NOTE: For full terminal experience, use desktop", 
          color: COLORS.WARNING,
          animation: "ascii-flicker" 
        }
      ] : []),
      { text: "", color: COLORS.DEFAULT },
    ];

    setHistory(initialHistory);
  }, [isMobile]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string): void => {
    if (!cmd.trim()) return;

    const newHistory = [...history, { text: `$ ${cmd}`, color: COLORS.PROMPT }];

    // Save command to command history
    setCommandHistory((prev) => [cmd, ...prev]);
    setHistoryIndex(-1);

    // Process command
    const args = cmd.split(" ");
    const command = args[0].toLowerCase();

    switch (command) {
      case "help":
        newHistory.push(
          {
            text: "Available commands:",
            color: COLORS.HEADER,
          },
          { text: "  help     - Show this help message", color: COLORS.INFO },
          { text: "  clear    - Reset the terminal", color: COLORS.INFO },
          { text: "  cat      - Display file contents", color: COLORS.INFO },
          { text: "  date     - Show current date and time", color: COLORS.INFO },
          { text: "  ls       - List files", color: COLORS.INFO },
          { text: "  system   - Display system information", color: COLORS.INFO },
          { text: "", color: COLORS.DEFAULT }
        );
        break;

      case "clear":
        // Reset everything
        const initialHistory: HistoryItem[] = [
          // Choose ASCII art based on screen size
          ...(isMobile ? 
            // Mobile ASCII art with glow effect
            MOBILE_ASCII_ART.map((line) => ({
              text: line,
              color: COLORS.INFO,
              animation: "ascii-glow",
            }))
            : 
            // Desktop ASCII art with all effects
            [
              // Border top and padding with glow effect
              { text: ASCII_ART[0], color: COLORS.INFO, animation: "ascii-glow" },
              { text: ASCII_ART[1], color: COLORS.INFO, animation: "ascii-glow" },
              { text: ASCII_ART[2], color: COLORS.INFO, animation: "ascii-glow" },
              
              // "Singularity" ASCII art with flicker effect
              ...ASCII_ART.slice(3, 9).map((line) => ({
                text: line,
                color: COLORS.INFO,
                animation: "ascii-glow ascii-flicker",
              })),
              
              // Spacer
              { text: ASCII_ART[9], color: COLORS.INFO, animation: "ascii-glow" },
              
              // "Labs" ASCII art with just glow animation
              ...ASCII_ART.slice(10, 16).map((line) => ({
                text: line,
                color: COLORS.INFO,
                animation: "ascii-glow",
              })),
              
              // Footer lines with glow effect
              ...ASCII_ART.slice(16).map((line) => ({
                text: line,
                color: COLORS.INFO,
                animation: "ascii-glow",
              })),
            ]
          ),
          
          { text: "", color: COLORS.DEFAULT },
          {
            text: "Welcome to Singularity Labs Terminal v0.0.7 beta",
            color: COLORS.HEADER,
            animation: "type-effect",
          },
          { 
            text: 'Type "help" to see available commands', 
            color: COLORS.INFO
          },
          // Add mobile experience notice only for mobile users
          ...(isMobile ? [
            { text: "", color: COLORS.DEFAULT },
            { 
              text: "NOTE: For full terminal experience, use desktop", 
              color: COLORS.WARNING,
              animation: "ascii-flicker" 
            }
          ] : []),
          { text: "", color: COLORS.DEFAULT },
        ];
        setHistory(initialHistory);
        setCommandHistory([]);
        setHistoryIndex(-1);
        return;

      case "cat":
        if (args.length < 2) {
          newHistory.push(
            { text: "Usage: cat <filename>", color: COLORS.ERROR },
            { text: "", color: COLORS.DEFAULT }
          );
        } else {
          const filename = args[1].toLowerCase();
          switch (filename) {
            case "readme.md":
              // Check if mobile and use responsive text layout
              if (isMobile) {
                newHistory.push(
                  { text: "# Singularity Labs", color: COLORS.HEADER },
                  { text: "", color: COLORS.DEFAULT },
                  { text: "Singularity Labs is", color: COLORS.INFO },
                  { text: "building a network of", color: COLORS.INFO },
                  { text: "AI agents that reward", color: COLORS.INFO },
                  { text: "and incentivize users", color: COLORS.INFO },
                  { text: "who actively contribute", color: COLORS.INFO },
                  { text: "to communities with", color: COLORS.INFO },
                  { text: "shared beliefs and goals.", color: COLORS.INFO },
                  { text: "", color: COLORS.DEFAULT },
                  { text: "The agents track", color: COLORS.INFO },
                  { text: "sentiment, identify", color: COLORS.INFO },
                  { text: "emerging trends and", color: COLORS.INFO },
                  { text: "gather insights from X,", color: COLORS.INFO },
                  { text: "Telegram, and Discord.", color: COLORS.INFO },
                  { text: "", color: COLORS.DEFAULT },
                  { text: "Coming soon!", color: COLORS.SUCCESS },
                  { text: "", color: COLORS.DEFAULT }
                );
              } else {
                newHistory.push(
                  { text: "# Singularity Labs", color: COLORS.HEADER },
                  { text: "", color: COLORS.DEFAULT },
                  { text: "Singularity Labs is building a network of AI agents that reward and", color: COLORS.INFO },
                  { text: "incentivize users who actively contribute to communities with shared", color: COLORS.INFO },
                  { text: "beliefs and goals. The agents track sentiment, identify emerging trends", color: COLORS.INFO },
                  { text: "and gather insights from X, Telegram, and Discord.", color: COLORS.INFO },
                  { text: "", color: COLORS.DEFAULT },
                  { text: "Coming soon!", color: COLORS.SUCCESS },
                  { text: "", color: COLORS.DEFAULT }
                );
              }
              break;
            default:
              newHistory.push(
                { text: `File not found: ${filename}`, color: COLORS.ERROR },
                { text: "", color: COLORS.DEFAULT }
              );
          }
        }
        break;

      case "date":
        newHistory.push(
          { text: `${new Date().toLocaleString()}`, color: COLORS.INFO },
          { text: "", color: COLORS.DEFAULT }
        );
        break;
        
      case "ls":
        newHistory.push(
          { text: "readme.md", color: COLORS.FILE },
          { text: "", color: COLORS.DEFAULT }
        );
        break;

      case "system":
        newHistory.push(
          { text: "SYSTEM INFORMATION", color: COLORS.HEADER },
          { text: "", color: COLORS.DEFAULT },
          { text: "OS: Singularity Labs OS v0.0.7 beta", color: COLORS.INFO },
          { text: "Architecture: x86_64", color: COLORS.INFO },
          { text: "Kernel: SL-kernel 4.2.1", color: COLORS.INFO },
          { text: "Memory: 512MB / 1024MB", color: COLORS.INFO },
          { text: "Disk: 8.2GB / 10GB", color: COLORS.INFO },
          { text: "Uptime: 32 days, 4 hours, 12 minutes", color: COLORS.INFO },
          { text: "", color: COLORS.DEFAULT }
        );
        break;
        
      // Easter egg command - hidden, psychedelic color effect for entire terminal
      case "singularity":
        // Set singularity mode to true (no text output)
        setSingularityMode(true);
        
        // Remove the effect after animation completes (8 seconds)
        setTimeout(() => {
          setSingularityMode(false);
        }, 8000);
        
        break;

      default:
        newHistory.push(
          { text: `Command not found: ${command}`, color: COLORS.ERROR },
          { text: "", color: COLORS.DEFAULT }
        );
    }

    setHistory(newHistory);
  };

  // Function to get available files for autocomplete
  const getAvailableFiles = (): string[] => {
    return ["readme.md"]; // Only one file is available
  };

  // Function to get available commands for autocomplete
  const getAvailableCommands = (): string[] => {
    // Don't include the easter egg in autocomplete suggestions
    return ["help", "clear", "cat", "date", "ls", "system"];
  };
  
  // State to track singularity mode
  const [singularityMode, setSingularityMode] = useState(false);

  // Function to autocomplete input (both commands and file paths)
  const autocompleteInput = (currentInput: string): string => {
    const args = currentInput.split(" ");
    
    // If no space, we're autocompleting a command
    if (args.length === 1 && currentInput.length > 0) {
      const commandFragment = args[0].toLowerCase();
      const availableCommands = getAvailableCommands();
      
      // Find commands that match the fragment
      const matchingCommands = availableCommands.filter(cmd => 
        cmd.startsWith(commandFragment)
      );
      
      // If exactly one match, autocomplete it
      if (matchingCommands.length === 1) {
        return matchingCommands[0];
      }
      
      // If multiple matches, show them to the user
      if (matchingCommands.length > 1) {
        setHistory(prev => [
          ...prev,
          { text: `$ ${currentInput}`, color: COLORS.PROMPT },
          { text: matchingCommands.join("  "), color: COLORS.INFO },
          { text: "", color: COLORS.DEFAULT }
        ]);
      }
    }
    
    // If we have a command and possibly a file path, check for file autocomplete
    const command = args[0].toLowerCase();
    if (["cat"].includes(command) && args.length > 1) {
      const fileFragment = args[args.length - 1].toLowerCase();
      const availableFiles = getAvailableFiles();
      
      // Find files that match the fragment
      const matchingFiles = availableFiles.filter(file => 
        file.toLowerCase().startsWith(fileFragment)
      );
      
      // If exactly one match, autocomplete it
      if (matchingFiles.length === 1) {
        const completedArgs = [...args];
        completedArgs[completedArgs.length - 1] = matchingFiles[0];
        return completedArgs.join(" ");
      }
      
      // If multiple matches, show them to the user
      if (matchingFiles.length > 1) {
        setHistory(prev => [
          ...prev,
          { text: `$ ${currentInput}`, color: COLORS.PROMPT },
          ...matchingFiles.map(file => ({ text: file, color: COLORS.FILE })),
          { text: "", color: COLORS.DEFAULT }
        ]);
      }
    }
    
    return currentInput;
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
    } else if (e.key === "Tab") {
      e.preventDefault(); // Prevent focus change
      const completedInput = autocompleteInput(input);
      setInput(completedInput);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
  };

  const handleClick = (): void => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Available commands for command buttons
  const commandButtons = ["help", "clear", "ls", "cat readme.md", "date", "system"];

  return (
    <div
      className={`h-screen p-4 font-mono overflow-auto ${singularityMode ? 'singularity-mode' : 'bg-black'}`}
      onClick={handleClick}
      ref={terminalRef}
    >
      <div className="max-w-3xl mx-auto">
        {/* Mobile-adaptive content - overflow handling for ASCII art */}
        <div className="overflow-x-auto">
          {history.map((item, i) => (
            <Line
              key={i}
              text={item.text}
              color={item.color}
              className={item.className}
              animation={item.animation}
            />
          ))}
        </div>
        <div className="flex text-green-300 text-xs">
          <span>$ </span>
          <input
            type="text"
            ref={inputRef}
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="flex-grow bg-transparent outline-none border-none text-green-300 font-mono text-xs ml-1"
            autoFocus
          />
        </div>
        
        {/* Command buttons for mobile users */}
        <div className="pt-4 md:hidden">
          <div className="grid grid-cols-2 gap-2">
            {commandButtons.map((cmd) => (
              <button
                key={cmd}
                onClick={() => {
                  handleCommand(cmd);
                }}
                className="bg-green-900 border border-green-500 text-green-300 py-2 px-3 rounded text-xs hover:bg-green-800 active:bg-green-700"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return <Terminal />;
}

export default App;
