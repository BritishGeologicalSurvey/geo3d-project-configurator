# Geo3D Project Configuration Generator

A schema-driven configuration editor for creating, validating and managing Geo3D project definitions.

---

## Overview

The Geo3D Project Configuration Generator is a web-based application that enables geological modelling teams, geological surveys, research organisations and Geo3D platform administrators to create high-quality Geo3D configuration files through an intuitive form-based interface rather than manually editing JSON documents.

The application uses a schema-first design methodology, where JSON Schema definitions act as the authoritative source for configuration structure, validation rules, documentation and user interface generation. This ensures consistency across projects and significantly reduces the likelihood of invalid or incomplete configurations.

The tool currently supports:

- Geo3D Project Configuration files
- Geo3D Project List files
- Generalised Vertical Section (GVS) configuration files

---

# Purpose

Geo3D projects require extensive metadata describing geological models, associated datasets, visualisation behaviour, user interface features and rendering settings. Traditionally these configurations have been authored manually as JSON files.

While flexible, manual editing introduces several challenges:

- Complex nested structures
- Validation errors
- Inconsistent project definitions
- Difficult onboarding for non-developers
- Limited discoverability of available configuration options

The Geo3D Project Configuration Generator addresses these issues by providing a guided authoring experience built directly from formal schema definitions.

---

# Schema-First Methodology

## Single Source of Truth

The application is built around JSON Schema.

The schema defines:

- Data structures
- Required properties
- Validation rules
- Allowed values
- Documentation
- Relationships between objects
- Feature configuration requirements

Rather than building forms manually, the user interface is generated dynamically from the schema.

```text
JSON Schema
      ↓
Generated User Interface
      ↓
Validation Rules
      ↓
Configuration Editor
      ↓
Exported Project File
```

This approach ensures that the editor, validation logic and exported configuration all remain synchronised.

---

## Self-Documenting Configurations

Project schemas contain extensive descriptions explaining the purpose and expected usage of configuration fields.

These descriptions are surfaced directly within the application, allowing users to understand:

- Geological meaning
- Technical requirements
- Recommended usage
- Visualisation behaviour
- Feature-specific configuration options

This transforms the editor into both an authoring environment and a knowledge-sharing tool.

---

## Validation-Driven Workflow

Validation is performed continuously while users edit a project.

The editor automatically identifies:

- Missing required properties
- Invalid data types
- Incorrect object structures
- Unsupported values
- Schema violations

Invalid configurations are highlighted immediately and project files cannot be downloaded until required information has been supplied.

This helps ensure that exported files are ready for deployment within Geo3D environments.

---

# Supported Configuration Types

## Geo3D Project Configuration

A project configuration defines an entire geological visualisation.

This includes:

### Geological Content

- Voxel models
- Structured grids
- Surface models
- Boreholes and wells
- Areas
- Annotations
- Textures

### Data Organisation

- Layer groups
- Layer hierarchies
- Layer ordering
- Attributes
- Multilingual text
- Data sources

### Viewer Configuration

- Coordinate reference systems
- Camera settings
- Bounding boxes
- Rendering options
- Vertical exaggeration
- Lighting and display behaviour

### User Features

- Coordinate grids
- Cross-sections
- Line cross-sections
- Virtual drilling
- Dip and azimuth tools
- Camera views
- Screenshots
- Printing
- Base map services
- Information panels

---

## Project Lists

Project Lists provide a structured catalogue of available Geo3D projects.

They support:

- Project discovery
- Metadata management
- Thumbnail management
- Project descriptions
- External project references

Project Lists are typically used to build galleries or launchers that allow users to browse and load available Geo3D projects.

---

## Generalised Vertical Section (GVS) Configuration

The GVS editor provides tooling for working with Generalised Vertical Section datasets.

Capabilities include:

- Importing tab-delimited GVS files
- Editing geological units
- Managing display colours
- Reordering stratigraphic layers
- Exporting validated GVS configurations

The application can additionally transform GVS definitions into Geo3D layer structures, supporting rapid generation of project content from existing vertical section datasets.

---

# Technical Architecture

The application is built using:

- React
- TypeScript
- Vite
- Material UI
- JSON Forms
- AJV JSON Schema Validation
- Playwright End-to-End Testing

Custom Geo3D-specific renderers provide enhanced editing experiences for:

- Feature toggles
- Multilingual text
- Geological layers
- Colour selection
- Language selection
- Well configuration objects
- Complex schema structures

---

# Vision

The Geo3D Project Configuration Generator aims to make configuration authoring transparent, repeatable and accessible by combining geological domain expertise with formal schema-based validation.

By treating project schemas as the authoritative specification, the application provides a sustainable foundation for creating consistent, high-quality Geo3D projects while reducing technical barriers for modelling specialists.

---

# Licence

MIT License

Copyright (c) UKRI (British Geological Survey) and the Polish Geological Institute 2026