-- Enable Row Level Security
alter table auth.users enable row level security;

-- Create profiles table
create table if not exists profiles (
  id uuid references auth.users(id) primary key,
  email text unique not null,
  full_name text not null,
  role text not null default 'worker',
  department text not null,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table profiles enable row level security;

-- Create RLS policies for profiles
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Create incidents table
create table if not exists incidents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  description text not null,
  severity text check (severity in ('low', 'medium', 'high', 'critical')) not null,
  status text check (status in ('open', 'investigating', 'resolved', 'closed')) default 'open',
  location text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on incidents
alter table incidents enable row level security;

-- Create RLS policies for incidents
create policy "Users can view all incidents" on incidents for select using (true);
create policy "Users can insert incidents" on incidents for insert with check (auth.uid() = user_id);
create policy "Users can update own incidents" on incidents for update using (auth.uid() = user_id);

-- Create training_courses table
create table if not exists training_courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  duration_hours integer not null default 1,
  is_mandatory boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on training_courses
alter table training_courses enable row level security;

-- Create RLS policies for training_courses
create policy "All users can view training courses" on training_courses for select using (true);

-- Create user_trainings table
create table if not exists user_trainings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  course_id uuid references training_courses(id) not null,
  status text check (status in ('enrolled', 'in_progress', 'completed', 'expired')) default 'enrolled',
  completion_date timestamp with time zone,
  expiry_date timestamp with time zone,
  score integer check (score >= 0 and score <= 100),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, course_id)
);

-- Enable RLS on user_trainings
alter table user_trainings enable row level security;

-- Create RLS policies for user_trainings
create policy "Users can view own trainings" on user_trainings for select using (auth.uid() = user_id);
create policy "Users can update own trainings" on user_trainings for update using (auth.uid() = user_id);

-- Create ppe_inspections table
create table if not exists ppe_inspections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  equipment_type text not null,
  equipment_id text not null,
  inspection_date date not null,
  condition text check (condition in ('excellent', 'good', 'fair', 'poor', 'dangerous')) not null,
  notes text,
  next_inspection date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on ppe_inspections
alter table ppe_inspections enable row level security;

-- Create RLS policies for ppe_inspections
create policy "Users can view all inspections" on ppe_inspections for select using (true);
create policy "Users can insert inspections" on ppe_inspections for insert with check (auth.uid() = user_id);
create policy "Users can update own inspections" on ppe_inspections for update using (auth.uid() = user_id);

-- Create risk_assessments table
create table if not exists risk_assessments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  area text not null,
  risk_type text not null,
  description text not null,
  probability integer check (probability >= 1 and probability <= 5) not null,
  severity integer check (severity >= 1 and severity <= 5) not null,
  risk_score integer generated always as (probability * severity) stored,
  mitigation_measures text not null,
  status text check (status in ('identified', 'mitigating', 'controlled', 'closed')) default 'identified',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on risk_assessments
alter table risk_assessments enable row level security;

-- Create RLS policies for risk_assessments
create policy "Users can view all risk assessments" on risk_assessments for select using (true);
create policy "Users can insert risk assessments" on risk_assessments for insert with check (auth.uid() = user_id);
create policy "Users can update own risk assessments" on risk_assessments for update using (auth.uid() = user_id);

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role, department)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', 'Usuario'),
    coalesce(new.raw_user_meta_data->>'role', 'worker'),
    coalesce(new.raw_user_meta_data->>'department', 'General')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Insert sample training courses
insert into training_courses (title, description, duration_hours, is_mandatory) values
  ('Uso de EPP', 'Capacitación sobre el uso correcto de Equipos de Protección Personal', 2, true),
  ('Primeros Auxilios', 'Curso básico de primeros auxilios en el lugar de trabajo', 4, true),
  ('Prevención de Riesgos', 'Identificación y prevención de riesgos laborales', 3, true),
  ('Manejo de Crisis', 'Procedimientos de emergencia y manejo de crisis', 6, false),
  ('ISO 45001', 'Sistema de gestión de seguridad y salud ocupacional', 8, false)
on conflict do nothing;