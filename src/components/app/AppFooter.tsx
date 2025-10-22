const AppFooter = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ATSmooth. All rights reserved.
      </div>
    </footer>
  );
};

export default AppFooter;
