-- Create user_templates table
CREATE TABLE IF NOT EXISTS user_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_pl TEXT NOT NULL,
    name_en TEXT,
    name_uk TEXT,
    name_ru TEXT,
    content_pl TEXT NOT NULL,
    content_en TEXT,
    content_uk TEXT,
    content_ru TEXT,
    category_id UUID REFERENCES categories(id),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE user_templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own templates"
    ON user_templates
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own templates"
    ON user_templates
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
    ON user_templates
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates"
    ON user_templates
    FOR DELETE
    USING (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can view all templates"
    ON user_templates
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.role = 'admin'
        )
    );

CREATE POLICY "Admins can insert templates for any user"
    ON user_templates
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.role = 'admin'
        )
    );

CREATE POLICY "Admins can update any template"
    ON user_templates
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.role = 'admin'
        )
    );

CREATE POLICY "Admins can delete any template"
    ON user_templates
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.role = 'admin'
        )
    );

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON user_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 