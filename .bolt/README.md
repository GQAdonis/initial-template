# Prometheus Bolt.diy Template

This directory contains configuration files and templates for the [bolt.diy](https://github.com/Sourceprog/bolt.diy) open source project, which allows you to generate, run, edit, and deploy full-stack web applications using various LLMs.

## Overview

The Prometheus template provides a comprehensive foundation for building generative AI applications with a focus on:

- Cross-platform deployment (web, mobile, desktop)
- Modern React frontend with Shadcn-UI
- Tauri integration for native desktop applications
- Rust backend for superior performance and security
- Built-in AI capabilities using CoPilotKit

## Directory Structure

- `.bolt/config.json`: Main configuration file for bolt.diy templates
- `.bolt/templates/`: Contains template-specific configuration and guidance
- `.bolt/rules/`: Contains rules for code generation and quality enforcement

## Usage

To use this template with bolt.diy:

1. Clone this repository to your local machine
2. Open the project in bolt.diy
3. Select one of the available templates from the template selector
4. Follow the prompts to customize your application
5. Let bolt.diy generate your application scaffolding

## Templates

The Prometheus template offers several specialized configurations:

1. **React + Tauri + AI Application**: Full-stack cross-platform application
2. **Web-Only AI Application**: Lightweight web-focused application
3. **Mobile-Optimized AI Application**: Touch-friendly mobile-focused application

## Development Guidelines

All generated code will adhere to the rules and best practices defined in:

- `.clinerules`: Guidelines for Claude AI code generation
- `.winsurfrules`: Guidelines for Windsurf AI code generation
- `.bolt/rules/`: Specific rules for bolt.diy code generation

## License

This template is provided under the MIT License.
