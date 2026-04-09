import useTheme from "@/hooks/useTheme";

const GREETINGS = {
  default: [
    {
      range: [5, 12],
      text: "Good Morning, ",
      colors: {
        light: "text-yellow-500",
        dark: "text-yellow-300",
      },
    },
    {
      range: [12, 17],
      text: "Good Afternoon, ",
      colors: {
        light: "text-blue-700",
        dark: "text-blue-300",
      },
    },
    {
      range: [17, 22],
      text: "Good Evening, ",
      colors: {
        light: "text-violet-700",
        dark: "text-violet-300",
      },
    },
    {
      range: [22, 24],
      text: "Wind down, ",
      colors: {
        light: "text-slate-700",
        dark: "text-slate-300",
      },
    },
    {
      range: [0, 5],
      text: "Late Night, ",
      colors: {
        light: "text-indigo-800",
        dark: "text-indigo-400",
      },
    },
  ],

  notification: [
    {
      range: [5, 12],
      text: "Start your day,",
      colors: {
        light: "text-yellow-600",
        dark: "text-yellow-300",
      },
    },
    {
      range: [12, 17],
      text: "Stay on track,",
      colors: {
        light: "text-blue-700",
        dark: "text-blue-300",
      },
    },
    {
      range: [17, 22],
      text: "Wind things down,",
      colors: {
        light: "text-violet-700",
        dark: "text-violet-300",
      },
    },
    {
      range: [22, 24],
      text: "Time to rest,",
      colors: {
        light: "text-indigo-800",
        dark: "text-indigo-400",
      },
    },
    {
      range: [0, 5],
      text: "You’re up late,",
      colors: {
        light: "text-indigo-800",
        dark: "text-indigo-400",
      },
    },
  ],
};

const GetGreeting = ({ variant = 1 }) => {
  const { theme } = useTheme();
  const hour = new Date().getHours();

  const mode = variant === 2 ? "notification" : "default";
  const config = GREETINGS[mode];

  const current = config.find(
    ({ range: [start, end] }) => hour >= start && hour < end
  );

  if (!current) return null;

  const className =
    theme === "dark" ? current.colors.dark : current.colors.light;

  return <span className={className}>{current.text}</span>;
};

export default GetGreeting;