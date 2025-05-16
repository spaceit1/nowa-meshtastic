-- Create user message templates table
CREATE TABLE user_message_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_pl TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_uk TEXT NOT NULL,
    name_ru TEXT NOT NULL,
    content_pl TEXT NOT NULL,
    content_en TEXT NOT NULL,
    content_uk TEXT NOT NULL,
    content_ru TEXT NOT NULL,
    category_id UUID REFERENCES categories(id),
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    is_public BOOLEAN DEFAULT true NOT NULL
);

-- Create RLS policies
ALTER TABLE user_message_templates ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read public templates
CREATE POLICY "Allow authenticated users to read public templates"
    ON user_message_templates
    FOR SELECT
    TO authenticated
    USING (is_public = true);

-- Allow users to read their own templates
CREATE POLICY "Allow users to read their own templates"
    ON user_message_templates
    FOR SELECT
    TO authenticated
    USING (auth.uid() = created_by);

-- Allow users to create their own templates
CREATE POLICY "Allow users to create their own templates"
    ON user_message_templates
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

-- Allow users to update their own templates
CREATE POLICY "Allow users to update their own templates"
    ON user_message_templates
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = created_by)
    WITH CHECK (auth.uid() = created_by);

-- Allow users to delete their own templates
CREATE POLICY "Allow users to delete their own templates"
    ON user_message_templates
    FOR DELETE
    TO authenticated
    USING (auth.uid() = created_by);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_message_templates_updated_at
    BEFORE UPDATE ON user_message_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 