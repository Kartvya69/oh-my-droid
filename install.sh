#!/bin/bash
#
# Oh-My-Droid Installation Script
# Supports: npm link (local dev) and global install
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running from correct directory
check_directory() {
    if [ ! -f "package.json" ]; then
        print_error "Please run this script from the oh-my-droid root directory"
        exit 1
    fi

    if [ ! -f "src/index.ts" ]; then
        print_error "Source files not found. Are you in the correct directory?"
        exit 1
    fi
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."

    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 20+ first."
        exit 1
    fi

    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 20 ]; then
        print_error "Node.js 20+ required. Found: $(node -v)"
        exit 1
    fi

    print_success "Node.js $(node -v) found"

    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi

    print_success "npm $(npm -v) found"

    # Check Droid (optional)
    if command -v droid &> /dev/null; then
        print_success "Droid CLI found"
    else
        print_warning "Droid CLI not found. Install from https://factory.ai"
    fi
}

# Install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
}

# Build project
build_project() {
    print_info "Building project..."
    if npm run build; then
        print_success "Build completed"
    else
        print_warning "Build had errors, but continuing..."
    fi
}

# Setup npm link (local development)
setup_npm_link() {
    print_info "Setting up npm link for local development..."

    # Remove old link if exists
    if [ -L "$(npm root -g)/oh-my-droid" ]; then
        print_info "Removing old npm link..."
        npm unlink -g oh-my-droid 2>/dev/null || true
    fi

    # Create link
    npm link

    print_success "npm link created!"
    print_info "You can now use 'oh-my-droid' or 'omd' commands globally"
    print_info "To uninstall later, run: npm unlink -g oh-my-droid"
}

# Global install from source
setup_global_install() {
    print_info "Installing globally from source..."

    # Build first
    npm run build

    # Pack and install
    npm pack
    PACKAGE=$(ls -t *.tgz | head -1)
    npm install -g "$PACKAGE"

    print_success "Installed globally!"
    print_info "You can now use 'oh-my-droid' or 'omd' commands"
}

# Setup OMD configuration
setup_omd_config() {
    print_info "Setting up Oh-My-Droid configuration..."

    OMD_DIR="$HOME/.omd"
    DROIDS_DIR="$HOME/.factory/droids"

    # Create directories
    mkdir -p "$OMD_DIR"/{state,skills,hooks}
    mkdir -p "$DROIDS_DIR"

    # Create default config if not exists
    if [ ! -f "$OMD_DIR/config.json" ]; then
        cat > "$OMD_DIR/config.json" << 'EOF'
{
  "agents": {
    "coordinator": { "model": "inherit", "enabled": true },
    "oracle": { "model": "claude-opus", "enabled": true },
    "librarian": { "model": "claude-sonnet", "enabled": true },
    "architect": { "model": "claude-opus", "enabled": true },
    "executor": { "model": "inherit", "enabled": true }
  },
  "features": {
    "parallelExecution": true,
    "continuationEnforcement": true,
    "autoContextInjection": true,
    "magicKeywords": true,
    "verificationProtocol": true
  }
}
EOF
        print_success "Created default config at ~/.omd/config.json"
    fi

    # Copy droid templates
    if [ -d "droids" ]; then
        cp -r droids/* "$DROIDS_DIR/" 2>/dev/null || true
        print_success "Installed custom droids to ~/.factory/droids/"
    fi

    print_success "OMD configuration complete"
}

# Main installation
main() {
    echo "========================================"
    echo "  Oh-My-Droid Installation Script"
    echo "========================================"
    echo ""

    check_directory
    check_prerequisites

    # Parse arguments
    MODE="${1:-link}"  # Default to 'link' if no argument

    case "$MODE" in
        link)
            print_info "Mode: npm link (local development)"
            install_dependencies
            build_project
            setup_npm_link
            ;;
        global)
            print_info "Mode: global install"
            install_dependencies
            setup_global_install
            ;;
        config)
            print_info "Mode: config only"
            setup_omd_config
            exit 0
            ;;
        *)
            echo "Usage: $0 [link|global|config]"
            echo ""
            echo "Modes:"
            echo "  link    - Use npm link for local development (default)"
            echo "  global  - Install globally from source"
            echo "  config  - Setup configuration only"
            echo ""
            exit 1
            ;;
    esac

    setup_omd_config

    echo ""
    echo "========================================"
    print_success "Installation complete!"
    echo "========================================"
    echo ""
    echo "Try these commands:"
    echo "  omd --version"
    echo "  omd status"
    echo "  omd agents"
    echo ""
    echo "Or use magic keywords in Droid:"
    echo "  autopilot: build a REST API"
    echo "  ralph: migrate to TypeScript"
    echo ""
}

# Run main
main "$@"
