# Unraid Storage Planner

A simple, interactive front-end web application to visualize and plan your Unraid server storage array. 

## Features

- **Visual Array Builder:** Add, remove, and visualize drives in real-time.
- **Parity Configuration:** Toggle between 0, 1, or 2 parity drives.
- **Automatic Calculations:** Instantly calculates total raw space, usable data space, effective parity space, and wasted/unused space.
- **Unraid Rules Applied:** Automatically sorts drives and ensures parity drives are assigned to the largest disks in the array.
- **Custom Drive Sizes:** Quick-add common drive sizes or enter custom capacities.

## Built With

- React
- Tailwind CSS
- Framer Motion (Animations)
- Lucide React (Icons)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/your-username/Unraid-Drive-Visualizer.git
```
2. Navigate to the project directory:
```bash
cd Unraid-Drive-Visualizer
```
3. Install dependencies:
```bash
npm install
```
4. Start the development serve:
```bash
npm run dev
```

## Disclaimer
This project is not affiliated with, endorsed by, or sponsored by Unraid or Lime Technology, Inc. It is a community-created tool for educational and planning purposes.