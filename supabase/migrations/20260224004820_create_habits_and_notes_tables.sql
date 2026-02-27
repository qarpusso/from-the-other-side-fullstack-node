/*
  # Create Habits and Notes Tables

  1. New Tables
    - `habits`
      - `id` (uuid, primary key) - Unique identifier for each habit
      - `name` (text, required) - Name of the habit
      - `description` (text, optional) - Description of the habit
      - `frequency` (text, required) - How often to track (daily, weekly)
      - `created_at` (timestamptz) - When the habit was created
    
    - `habit_logs`
      - `id` (uuid, primary key) - Unique identifier for each log entry
      - `habit_id` (uuid, foreign key) - References habits table
      - `completed_at` (timestamptz, required) - When the habit was completed
      - `notes` (text, optional) - Optional notes for this completion
    
    - `notes`
      - `id` (uuid, primary key) - Unique identifier for each note
      - `title` (text, required) - Title of the note
      - `content` (text, required) - Markdown content of the note
      - `created_at` (timestamptz) - When the note was created
      - `updated_at` (timestamptz) - When the note was last updated

  2. Security
    - Enable RLS on all tables
    - Since there's no authentication, allow public access for read/write operations
*/

-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  frequency text NOT NULL DEFAULT 'daily',
  created_at timestamptz DEFAULT now()
);

-- Create habit_logs table
CREATE TABLE IF NOT EXISTS habit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  notes text DEFAULT ''
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required)
CREATE POLICY "Allow public read access to habits"
  ON habits FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to habits"
  ON habits FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to habits"
  ON habits FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to habits"
  ON habits FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Allow public read access to habit_logs"
  ON habit_logs FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to habit_logs"
  ON habit_logs FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to habit_logs"
  ON habit_logs FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to habit_logs"
  ON habit_logs FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Allow public read access to notes"
  ON notes FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to notes"
  ON notes FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to notes"
  ON notes FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete to notes"
  ON notes FOR DELETE
  TO anon
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON habit_logs(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_completed_at ON habit_logs(completed_at);
CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at);